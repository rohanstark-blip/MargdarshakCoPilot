import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import OldAgePension from "@/pages/OldAgePension";
import DomicileCertificate from "@/pages/DomicileCertificate";
import IncomeCertificate from "@/pages/IncomeCertificate";
import CasteCertificate from "@/pages/CasteCertificate";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/old-age-pension" element={<OldAgePension />} />
        <Route path="/domicile-certificate" element={<DomicileCertificate />} />
        <Route path="/income-certificate" element={<IncomeCertificate />} />
        <Route path="/caste-certificate" element={<CasteCertificate />} />
      </Route>
    </Routes>
  );
}
