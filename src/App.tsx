import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import World from "./pages/World";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/world" element={<World />} />
    </Routes>
  );
}
