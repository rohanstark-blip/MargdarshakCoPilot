import { useState } from "react";
import FormShell from "@/components/FormShell";

export default function DomicileCertificate() {
  const [house, setHouse] = useState("");
  const [mohalla, setMohalla] = useState("");
  const [policeStation, setPoliceStation] = useState("");
  const [block, setBlock] = useState("");
  const [residenceYears, setResidenceYears] = useState("");
  const [residenceType, setResidenceType] = useState("");
  const [purpose, setPurpose] = useState("");

  return (
    <FormShell title="Domicile Certificate Application" titleHindi="निवास प्रमाण पत्र — Nivas Praman Patra">
      {({ name, setName, dob, setDob, village, setVillage, postOffice, setPostOffice, tehsil, setTehsil, district, setDistrict, state, setState, pincode, setPincode, fatherName, setFatherName, motherName, setMotherName, gender, setGender, aadhaar, setAadhaar, mobile, setMobile }) => (
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
            Address / पूरा पता
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">House No. / मकान नं.</label>
              <input type="text" value={house} onChange={(e) => setHouse(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Mohalla / Ward / मोहल्ला</label>
              <input type="text" value={mohalla} onChange={(e) => setMohalla(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Village / Gram / ग्राम</label>
              <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Post Office</label>
              <input type="text" value={postOffice} onChange={(e) => setPostOffice(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Police Station / थाना</label>
              <input type="text" value={policeStation} onChange={(e) => setPoliceStation(e.target.value)} className="gov-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Tehsil / तहसील</label>
              <input type="text" value={tehsil} onChange={(e) => setTehsil(e.target.value)} className="gov-input" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Block / ब्लॉक</label>
              <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} className="gov-input" />
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

          <div className="bg-gov-blue/5 border-l-4 border-gov-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider">
            Residence Proof / निवास प्रमाण
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Years of Residence / निवास अवधि</label>
              <input type="text" value={residenceYears} onChange={(e) => setResidenceYears(e.target.value)} placeholder="e.g. 15" className="gov-input font-mono" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Residence Type</label>
              <select value={residenceType} onChange={(e) => setResidenceType(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="own">Own House / स्वयं का मकान</option>
                <option value="rented">Rented / किराये पर</option>
                <option value="relative">Relative's / रिश्तेदार का</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider mb-2">Purpose / उद्देश्य</label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="gov-input">
                <option value="">Select</option>
                <option value="education">Education / शिक्षा</option>
                <option value="employment">Employment / रोजगार</option>
                <option value="scholarship">Scholarship / छात्रवृत्ति</option>
                <option value="other">Other / अन्य</option>
              </select>
            </div>
          </div>
        </>
      )}
    </FormShell>
  );
}
