import React, { useState } from "react";

export default function AddEmployeeModal({ isOpen, onClose, onCreate }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    department: "",
    active: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(form);
    onClose();
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      department: "",
      active: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Create New Employee</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input name="first_name" placeholder="First Name" value={form.first_name} onChange={handleChange} required />
          <input name="last_name" placeholder="Last Name" value={form.last_name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input name="role" placeholder="Role" value={form.role} onChange={handleChange} />
          <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
          <label>
            <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
            Active
          </label>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button type="submit" style={btn}>Add</button>
            <button type="button" style={btnOutline} onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100%",
  width: "100%",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const modal = {
  background: "#fff",
  padding: 24,
  borderRadius: 10,
  minWidth: 320,
};

const btn = {
  padding: "8px 12px",
  borderRadius: 6,
  background: "#1d4ed8",
  color: "#fff",
  border: "none",
  cursor: "pointer",
};

const btnOutline = {
  ...btn,
  background: "transparent",
  color: "#1d4ed8",
  border: "1px solid #1d4ed8",
};
