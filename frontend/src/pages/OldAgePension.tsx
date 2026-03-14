import { useState } from "react";
import FormShell from "@/components/FormShell";

export default function OldAgePension() {
  const [fatherName, setFatherName] = useState("");
  const [gender, setGender] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [annualIncome, setAnnualIncome] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [bankName, setBankName] = useState("");
  const [house, setHouse] = useState("");
  const [village, setVillage] = useState("");
  const [postOffice, setPostOffice] = useState("");
  const [tehsil, setTehsil] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [bplCard, setBplCard] = useState("");
  const [existingPension, setExistingPension] = useState("");

  return (
    <FormShell title="Old Age Pension Application" titleHindi="वृद्धा पेंशन योजना — इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन">
      {({ name, setName, dob, setDob }) => (
        <>
          {/* Section: Personal Details */}
          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Personal Details / व्यक्तिगत विवरण
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                Applicant Name / आवेदक का नाम <span className="text-red-500">*</span>
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name as per Aadhaar" required className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
                Father's / Husband's Name / पिता/पति का नाम
              </label>
              <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="Guardian name" className="gov-input" />
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
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Gender / लिंग</label>
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

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Mobile Number / मोबाइल नंबर</label>
              <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Aadhaar-linked mobile" maxLength={10} className="gov-input font-mono" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">BPL Card Number</label>
              <input type="text" value={bplCard} onChange={(e) => setBplCard(e.target.value)} placeholder="If applicable" className="gov-input font-mono" />
            </div>
          </div>

          {/* Section: Address */}
          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Address Details / पता विवरण
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">House No. / Mohalla</label>
              <input type="text" value={house} onChange={(e) => setHouse(e.target.value)} placeholder="House number, street" className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Village / Gram / ग्राम</label>
              <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="Village name" className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Post Office</label>
              <input type="text" value={postOffice} onChange={(e) => setPostOffice(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Tehsil / तहसील</label>
              <input type="text" value={tehsil} onChange={(e) => setTehsil(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">District / जिला</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">State / राज्य</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">PIN Code</label>
              <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} className="gov-input font-mono" />
            </div>
          </div>

          {/* Section: Financial */}
          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Financial Details / वित्तीय विवरण
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Annual Income / वार्षिक आय (₹)</label>
              <input type="text" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="e.g. 45000" className="gov-input font-mono" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Income Source / आय का स्रोत</label>
              <select value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="agriculture">Agriculture / कृषि</option>
                <option value="labour">Daily Labour / दिहाड़ी मजदूरी</option>
                <option value="business">Small Business / छोटा व्यापार</option>
                <option value="none">No Income / कोई आय नहीं</option>
                <option value="other">Other / अन्य</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Bank Account No.</label>
              <input type="text" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className="gov-input font-mono" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">IFSC Code</label>
              <input type="text" value={ifsc} onChange={(e) => setIfsc(e.target.value)} placeholder="e.g. SBIN0001234" className="gov-input font-mono uppercase" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Bank Name</label>
              <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} className="gov-input" />
            </div>
          </div>

          {/* Declaration */}
          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Declaration / घोषणा
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">
              Already receiving any pension? / क्या पहले से कोई पेंशन प्राप्त कर रहे हैं?
            </label>
            <select value={existingPension} onChange={(e) => setExistingPension(e.target.value)} className="gov-input">
              <option value="">Select</option>
              <option value="no">No / नहीं</option>
              <option value="yes">Yes / हाँ</option>
            </select>
          </div>
        </>
      )}
    </FormShell>
  );
}
