import React, { useEffect, useMemo, useState } from "react";
import AddEmployeeModal from "../Components/AddEmployeeModal";


const fallbackEmployees = [
  { id: 1, name: "Alicia Stone", role: "Frontend Engineer", department: "Engineering", email: "alicia@company.com", status: "Active" },
  { id: 2, name: "Marcus Lee", role: "Product Manager", department: "Product", email: "marcus@company.com", status: "Active" },
  { id: 3, name: "Priya N.", role: "HR Generalist", department: "Human Resources", email: "priya@company.com", status: "On Leave" },
  { id: 4, name: "Diego Alvarez", role: "Data Analyst", department: "Analytics", email: "diego@company.com", status: "Inactive" },
];





function StatusPill({ value }) {
  const color =
    value === "Active" ? "#16a34a" : value === "On Leave" ? "#ca8a04" : "#dc2626";
  const bg =
    value === "Active" ? "rgba(22,163,74,.1)" : value === "On Leave" ? "rgba(202,138,4,.1)" : "rgba(220,38,38,.1)";
  return (
    <span style={{ color, background: bg, padding: "4px 10px", borderRadius: 999, fontSize: 12 }}>
      {value}
    </span>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  //chatbot
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);


  //chatbot 
  const handleChatSend = async () => {
  if (!chatInput.trim()) return;

  const userMessage = chatInput.trim();
  setChatMessages(prev => [...prev, { role: "user", content: userMessage }]);
  setChatInput("");
  setChatLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:8000/api/chatbot/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userMessage }),
    });

    const payload = await res.json();

    if (payload.error) {
      setChatMessages(prev => [...prev, { role: "bot", content: "❌ " + payload.error }]);
    } else {
      // Prefer natural language generation (if you send results back to LLM)
      const answer = payload.answer || JSON.stringify(payload.data || payload.sql);
      setChatMessages(prev => [...prev, { role: "bot", content: answer }]);
    }
  } catch (e) {
    setChatMessages(prev => [...prev, { role: "bot", content: "❌ Failed to fetch response." }]);
  } finally {
    setChatLoading(false);
  }
};

 const handleCreateEmployee = async (newEmp) => {
  try {
    const res = await fetch("/api/employees/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: newEmp.first_name,
        last_name: newEmp.last_name,
        email: newEmp.email,
        gender: newEmp.gender,
        date_of_birth: newEmp.date_of_birth,
        role_id: newEmp.role_id,             // dropdown value (id)
        department_id: newEmp.department_id, // dropdown value (id)
        job_title_id: newEmp.job_title_id,   // dropdown value (id)
        leaves_remaining: newEmp.leaves_remaining || 0,
        active: newEmp.active ?? true,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const saved = await res.json();

    // ✅ map backend response (which includes relations) into your flat UI structure
    const newMapped = {
      id: saved.id,
      name: `${saved.first_name ?? ""} ${saved.last_name ?? ""}`.trim(),
      role: saved.role?.name || "",               // comes from related table
      department: saved.department?.name || "",   // comes from related table
      job_title: saved.job_title?.title || "",    // comes from related table
      email: saved.email || "",
      status: saved.active ? "Active" : "Inactive",
      gender: saved.gender || "",
      dob: saved.date_of_birth || "",
      leaves: saved.leaves_remaining ?? 0,
    };

    // ✅ update frontend state
    setEmployees((prev) => [...prev, newMapped]);

  } catch (e) {
    alert("Failed to create employee: " + e.message);
  }
};


useEffect(() => {
  let cancelled = false;
  const controller = new AbortController();

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/employees", { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();

      const rows = Array.isArray(payload) ? payload : (payload.data || []);
      const mapped = rows.map(r => ({
  id: r.id,
  name: `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim(),
  role: r.role?.name ?? "",             // comes from relation
  department: r.department?.name ?? "", // comes from relation
  email: r.email ?? "",
  status: (r.active ? "Active" : "Inactive"),
  gender: r.gender ?? "",
  dob: r.date_of_birth ?? "",
  leaves: r.leaves_remaining ?? 0,
}));

      if (!cancelled) setEmployees(mapped);
    } catch (e) {
      if (!cancelled) {
        setEmployees(fallbackEmployees);
        setErr("Couldn’t load from API; showing local sample.");
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  }

  load();
  return () => { cancelled = true; controller.abort(); };
}, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter((e) =>
      [e.name, e.email, e.department, e.role].some((f) =>
        String(f || "").toLowerCase().includes(q)
      )
    );
  }, [employees, query]);

  return (

    
    
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Employees</h1>
        <div style={{ display: "flex", gap: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, role, department…"
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            width: 320,
          }}
        />
        <button style={btn} onClick={() => setIsModalOpen(true)}>Create</button>
        </div>
      </div>

      {loading ? (
        <p>Loading employees…</p>
      ) : err ? (
        <p style={{ color: "crimson" }}>{err}</p>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: 12 }}>
  <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
    <thead style={{ background: "#f8fafc" }}>
      <tr>
        <th style={th}>Name</th>
        <th style={th}>Role</th>
        <th style={th}>Department</th>
        <th style={th}>Job Title</th>
        <th style={th}>Email</th>
        <th style={th}>Gender</th>
        <th style={th}>DOB</th>
        <th style={th}>Leaves</th>
        <th style={th}>Status</th>
        <th style={{ ...th, textAlign: "right" }}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {filtered.map((e, idx) => (
        <tr key={e.id ?? idx} style={{ background: idx % 2 ? "#ffffff" : "#fbfdff" }}>
          <td style={td}>{e.name}</td>
          <td style={td}>{e.role}</td>
          <td style={td}>{e.department}</td>
          <td style={td}>{e.job_title}</td>
          <td style={td}>{e.email}</td>
          <td style={td}>{e.gender}</td>
          <td style={td}>{e.dob}</td>
          <td style={td}>{e.leaves}</td>
          <td style={td}>
            <StatusPill value={e.status || "Active"} />
          </td>
          <td style={{ ...td }}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button style={btn} onClick={() => alert(`View ${e.name}`)}>View</button>
              <button style={btnOutline} onClick={() => alert(`Edit ${e.name}`)}>Edit</button>
            </div>
          </td>
        </tr>
      ))}

      {filtered.length === 0 && (
        <tr>
          <td style={{ ...td, textAlign: "center" }} colSpan={10}>
            No employees found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
      )}
      <AddEmployeeModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onCreate={handleCreateEmployee}
    />
    <div style={{ position: "fixed", bottom: 20, right: 20 }}>
  {!chatOpen ? (
    <button
      style={{ ...btn, borderRadius: "50%", width: 60, height: 60 }}
      onClick={() => setChatOpen(true)}
    >
      💬
    </button>
  ) : (
    <div style={{
      width: 320,
      height: 400,
      background: "#fff",
      border: "1px solid #ccc",
      borderRadius: 12,
      display: "flex",
      flexDirection: "column",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
    }}>
      <div style={{ padding: "10px 12px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}>
        <strong>Chatbot</strong>
        <button onClick={() => setChatOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>✖</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {chatMessages.map((m, i) => (
          <div key={i} style={{
            textAlign: m.role === "user" ? "right" : "left",
            marginBottom: 10,
            fontSize: 14
          }}>
            <div style={{
              display: "inline-block",
              background: m.role === "user" ? "#dbeafe" : "#f3f4f6",
              color: "#111",
              padding: "8px 10px",
              borderRadius: 8,
              maxWidth: "80%"
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {chatLoading && <p>🤖 Thinking…</p>}
      </div>
      <div style={{ borderTop: "1px solid #eee", padding: 8 }}>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
          placeholder="Ask about employees…"
          style={{
            width: "100%",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
      </div>
    </div>
  )}
</div>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "12px 16px",
  fontWeight: 600,
  borderBottom: "1px solid #e5e7eb",
  color: "#0f172a",
};

const td = {
  padding: "12px 16px",
  borderBottom: "1px solid #f1f5f9",
  color: "#0f172a",
  fontSize: 14,
};

const btn = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #1d4ed8",
  background: "#1d4ed8",
  color: "white",
  cursor: "pointer",
};

const btnOutline = {
  ...btn,
  background: "transparent",
  color: "#1d4ed8",
  borderColor: "#1d4ed8",
};