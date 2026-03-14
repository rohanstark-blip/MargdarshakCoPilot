import { useState } from "react";
import FormShell from "@/components/FormShell";

export default function CasteCertificate() {
  const [subCaste, setSubCaste] = useState("");
  const [category, setCategory] = useState("");
  const [fatherCaste, setFatherCaste] = useState("");
  const [ancestralVillage, setAncestralVillage] = useState("");
  const [house, setHouse] = useState("");
  const [mohalla, setMohalla] = useState("");
  const [block, setBlock] = useState("");
  const [purpose, setPurpose] = useState("");
  const [parentCertNo, setParentCertNo] = useState("");

  return (
    <FormShell title="Caste Certificate Application" titleHindi="जाति प्रमाण पत्र — Jati Praman Patra">
      {({ name, setName, dob, setDob, village, setVillage, postOffice, setPostOffice, tehsil, setTehsil, district, setDistrict, state, setState, pincode, setPincode, fatherName, setFatherName, motherName, setMotherName, gender, setGender, aadhaar, setAadhaar, mobile, setMobile, caste, setCaste, religion, setReligion }) => (
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
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Father's Name / पिता का नाम</label>
              <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Mother's Name / माता का नाम</label>
              <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} className="gov-input" />
            </div>
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
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Aadhaar Number</label>
              <input type="text" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="XXXX XXXX XXXX" maxLength={14} className="gov-input font-mono tracking-widest" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Mobile Number</label>
              <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={10} className="gov-input font-mono" />
            </div>
          </div>

          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Caste / Community Details / जाति / समुदाय विवरण
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Category / श्रेणी</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="sc">SC / अनुसूचित जाति</option>
                <option value="st">ST / अनुसूचित जनजाति</option>
                <option value="obc">OBC / अन्य पिछड़ा वर्ग</option>
                <option value="ews">EWS / आर्थिक रूप से कमजोर</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Caste Name / जाति का नाम</label>
              <input type="text" value={caste} onChange={(e) => setCaste(e.target.value)} placeholder="e.g. Pasi, Kol, Yadav" className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Sub-Caste / उप-जाति</label>
              <input type="text" value={subCaste} onChange={(e) => setSubCaste(e.target.value)} placeholder="If applicable" className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Religion / धर्म</label>
              <select value={religion} onChange={(e) => setReligion(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="hindu">Hindu / हिन्दू</option>
                <option value="muslim">Muslim / मुस्लिम</option>
                <option value="sikh">Sikh / सिख</option>
                <option value="christian">Christian / ईसाई</option>
                <option value="buddhist">Buddhist / बौद्ध</option>
                <option value="jain">Jain / जैन</option>
                <option value="other">Other / अन्य</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Father's Caste / पिता की जाति</label>
              <input type="text" value={fatherCaste} onChange={(e) => setFatherCaste(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Ancestral Village / मूल ग्राम</label>
              <input type="text" value={ancestralVillage} onChange={(e) => setAncestralVillage(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Address / पता
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">House No.</label>
              <input type="text" value={house} onChange={(e) => setHouse(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Mohalla / Ward</label>
              <input type="text" value={mohalla} onChange={(e) => setMohalla(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Village / Gram</label>
              <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Post Office</label>
              <input type="text" value={postOffice} onChange={(e) => setPostOffice(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Tehsil</label>
              <input type="text" value={tehsil} onChange={(e) => setTehsil(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Block</label>
              <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">District / जिला</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">State / राज्य</label>
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">PIN Code</label>
            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} className="gov-input font-mono w-full sm:w-1/3" />
          </div>

          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Additional / अतिरिक्त विवरण
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Purpose / उद्देश्य</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="education">Education / शिक्षा</option>
                <option value="employment">Employment / रोजगार</option>
                <option value="scholarship">Scholarship / छात्रवृत्ति</option>
                <option value="reservation">Reservation / आरक्षण</option>
                <option value="other">Other / अन्य</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Parent's Certificate No. (if renewal)</label>
              <input type="text" value={parentCertNo} onChange={(e) => setParentCertNo(e.target.value)} placeholder="If applicable" className="gov-input font-mono" />
            </div>
          </div>
        </>
      )}
    </FormShell>
  );
}
