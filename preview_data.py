import pandas as pd

df = pd.read_csv('synthetic_applications.csv')
print(f'Total Records: {len(df)}')
print(f'\nApproved: {len(df[df["Status"] == "Approved"])} | Rejected: {len(df[df["Status"] == "Rejected"])}')
print('\n--- Sample Data (First 5 Rows) ---\n')
print(df.head(5).to_string())
print('\n--- Rejection Examples (Why records are rejected) ---\n')
print(df[df['Status'] == 'Rejected'][['Application_ID', 'Service_Type', 'Applicant_Age', 'Uploaded_Doc_Type', 'Status', 'Anomaly_Reason']].head(5).to_string())
