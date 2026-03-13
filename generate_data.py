import random
from faker import Faker
import pandas as pd

fake = Faker("en_IN")  # Use India locale for more realistic names/formats
Faker.seed(42)
random.seed(42)

SERVICE_TYPES = [
    "Old Age Pension",
    "Domicile Certificate",
    "Aadhaar Update",
    "Disability Pension",
    "Scholarship (SC/ST/OBC)",
    "Widow Pension",
    "Income Certificate",
]

DOC_TYPES = [
    "Aadhaar PDF",
    "Birth Certificate PDF",
    "Voter ID PDF",
    "Ration Card PDF",
    "Passport PDF",
    "Bank Passbook PDF",
    "Electricity Bill PDF",
]

STATUS = ["Approved", "Rejected"]

def make_anomaly(row):
    # Inject anomalies intentionally to cause rejection
    # 1) Old Age Pension but age too low
    if row["Service_Type"] == "Old Age Pension" and row["Applicant_Age"] < 60:
        row["Applicant_Age"] = random.randint(35, 50)
        row["Anomaly_Reason"] = "Age too low for Old Age Pension"
        row["Status"] = "Rejected"
        return row

    # 2) Domicile requires a local document type (e.g., Electricity Bill) but we give unrelated doc
    if row["Service_Type"] == "Domicile Certificate" and row["Uploaded_Doc_Type"] not in [
        "Electricity Bill PDF",
        "Ration Card PDF",
    ]:
        row["Anomaly_Reason"] = "Invalid supporting document for Domicile"
        row["Status"] = "Rejected"
        return row

    # 3) Aadhaar Update should have Aadhaar PDF
    if row["Service_Type"] == "Aadhaar Update" and row["Uploaded_Doc_Type"] != "Aadhaar PDF":
        row["Anomaly_Reason"] = "Missing Aadhaar PDF"
        row["Status"] = "Rejected"
        return row

    # 4) Scholarship should be age <= 25, otherwise reject
    if (
        row["Service_Type"] == "Scholarship (SC/ST/OBC)"
        and row["Applicant_Age"] > 25
    ):
        row["Anomaly_Reason"] = "Age exceeds scholarship eligibility"
        row["Status"] = "Rejected"
        return row

    # 5) Disability Pension must include Disability doc (we treat Disability as Voter ID / Bank Passbook as invalid)
    if row["Service_Type"] == "Disability Pension" and row["Uploaded_Doc_Type"] not in [
        "Aadhaar PDF",
        "Passport PDF",
    ]:
        row["Anomaly_Reason"] = "Unsupported document for Disability Pension"
        row["Status"] = "Rejected"
        return row

    # Default: Approved
    row["Status"] = "Approved"
    row["Anomaly_Reason"] = ""
    return row


def generate_single_application(idx: int):
    service = random.choice(SERVICE_TYPES)
    age = random.randint(18, 85)
    doc = random.choice(DOC_TYPES)

    return {
        "Application_ID": f"APP-{20260000 + idx}",
        "Service_Type": service,
        "Applicant_Name": fake.name(),
        "Applicant_Age": age,
        "Applicant_DOB": fake.date_of_birth(minimum_age=18, maximum_age=85).isoformat(),
        "Uploaded_Doc_Type": doc,
        "Submitted_On": fake.date_between(start_date="-180d", end_date="today").isoformat(),
        "Status": "",
        "Anomaly_Reason": "",
    }


def generate_dataset(count: int = 1000, output_path: str = "synthetic_applications.csv"):
    rows = []
    for i in range(count):
        row = generate_single_application(i + 1)
        row = make_anomaly(row)
        rows.append(row)

    df = pd.DataFrame(rows)

    # Ensure there is a good distribution between Approved/Rejected
    # Roughly 25% rejected for realistic model training.
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    df.to_csv(output_path, index=False)
    print(f"Generated {len(df)} rows → {output_path}")


if __name__ == "__main__":
    import sys
    print("Starting data generation...", file=sys.stderr)
    print("Starting data generation...", file=sys.stdout)
    sys.stdout.flush()
    sys.stderr.flush()
    generate_dataset(1000, "synthetic_applications.csv")
    print("Done!", file=sys.stderr)
    print("Done!", file=sys.stdout)
    sys.stdout.flush()
    sys.stderr.flush()