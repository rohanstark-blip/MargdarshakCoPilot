import { useState } from "react";
import FormShell from "@/components/FormShell";

export default function IncomeCertificate() {
  const [fatherName, setFatherName] = useState("");
  const [gender, setGender] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [occupation, setOccupation] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [landExtent, setLandExtent] = useState("");
  const [house, setHouse] = useState("");
  const [village, setVillage] = useState("");
  const [postOffice, setPostOffice] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [block, setBlock] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [purpose, setPurpose] = useState("");

  return (
    <FormShell title="Income Certificate Application" titleHindi="आय प्रमाण पत्र — Aay Praman Patra">
      {({ name, setName, dob, setDob }) => (
        <>
          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Personal Details / व्यक्तिगत विवरण
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                Applicant Name <span className="text-red-500">*</span>
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="As per Aadhaar" required className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Father's / Husband's Name</label>
              <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input type="text" value={dob} onChange={(e) => setDob(e.target.value)} placeholder="DD-MM-YYYY" required className="gov-input font-mono" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="male">Male / पुरुष</option>
                <option value="female">Female / महिला</option>
                <option value="other">Other / अन्य</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Aadhaar Number</label>
              <input type="text" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="XXXX XXXX XXXX" maxLength={14} className="gov-input font-mono tracking-widest" />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Mobile Number</label>
            <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={10} className="gov-input font-mono w-full sm:w-1/3" />
          </div>

          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Address / पता
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">House No. / Mohalla</label>
              <input type="text" value={house} onChange={(e) => setHouse(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Village / Gram</label>
              <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Post Office</label>
              <input type="text" value={postOffice} onChange={(e) => setPostOffice(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Tehsil</label>
              <input type="text" value={tehsil} onChange={(e) => setTehsil(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Block</label>
              <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">District / जिला</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">State / राज्य</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">PIN Code</label>
              <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} className="gov-input font-mono" />
            </div>
          </div>

          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Income Details / आय विवरण
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Occupation / व्यवसाय</label>
              <select value={occupation} onChange={(e) => setOccupation(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="salaried">Salaried / नौकरी</option>
                <option value="self_employed">Self Employed / स्वरोजगार</option>
                <option value="agriculture">Agriculture / कृषि</option>
                <option value="daily_labour">Daily Labour / दिहाड़ी मजदूर</option>
                <option value="business">Business / व्यापार</option>
                <option value="unemployed">Unemployed / बेरोजगार</option>
                <option value="retired">Retired / सेवानिवृत्त</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Income Source / आय का स्रोत</label>
              <select value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="salary">Salary / वेतन</option>
                <option value="agriculture">Agriculture / कृषि</option>
                <option value="business">Business / व्यापार</option>
                <option value="pension">Pension / पेंशन</option>
                <option value="rent">Rent / किराया</option>
                <option value="wages">Daily Wages / दैनिक मजदूरी</option>
                <option value="other">Other / अन्य</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Monthly Income / मासिक आय (₹)</label>
              <input type="text" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="e.g. 15000" className="gov-input font-mono" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Annual Income / वार्षिक आय (₹)</label>
              <input type="text" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="e.g. 180000" className="gov-input font-mono" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Employer Name (if salaried)</label>
              <input type="text" value={employerName} onChange={(e) => setEmployerName(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Land Extent (if agricultural)</label>
              <input type="text" value={landExtent} onChange={(e) => setLandExtent(e.target.value)} placeholder="e.g. 2 Bigha" className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Purpose / उद्देश्य</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="scholarship">Scholarship / छात्रवृत्ति</option>
                <option value="govt_scheme">Government Scheme / सरकारी योजना</option>
                <option value="loan">Loan / ऋण</option>
                <option value="education">Education / शिक्षा</option>
                <option value="legal">Legal / कानूनी</option>
                <option value="other">Other / अन्य</option>
              </select>
            </div>
          </div>
        </>
      )}
    </FormShell>
  );
}
