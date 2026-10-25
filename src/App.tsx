import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import World from "./pages/World";
import China from "./pages/China";
import Methods from "./pages/Methods";
import LongMarch from "./pages/LongMarch";
import ModernChina from "./pages/ModernChina";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/world" element={<World />} />
      <Route path="/china" element={<China />} />
      <Route path="/methods" element={<Methods />} />
      <Route path="/long-march" element={<LongMarch />} />
      <Route path="/modern-china" element={<ModernChina />} />
    </Routes>
  );
}
