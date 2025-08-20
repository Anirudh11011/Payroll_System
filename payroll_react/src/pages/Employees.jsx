import React, { useEffect, useMemo, useState } from "react";

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
        role: r.role ?? "",               // not in DB yet → default empty
        department: r.department ?? "",   // not in DB yet → default empty
        email: r.email ?? "",
        status: (r.active ? "Active" : "Inactive"),
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
                <th style={th}>Email</th>
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
                  <td style={td}>{e.email}</td>
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
                  <td style={{ ...td, textAlign: "center" }} colSpan={6}>
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
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