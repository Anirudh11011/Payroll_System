import { Routes, Route } from "react-router-dom";
import Leftbar from "./Components/Leftbar.jsx";
import Header from "./Components/Header.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";

export default function App() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <div style={{ flex: 1 }}>
        <Header />
        <main style={{ padding: 20 }}>
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}