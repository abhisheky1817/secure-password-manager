import { useEffect, useState } from "react";
import api from "../api/axios";

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [form, setForm] = useState({
    platform: "",
    username: "",
    password: "",
  });

  const fetchPasswords = async () => {
    const res = await api.get("/passwords/view");
    setPasswords(res.data);
  };

  useEffect(() => {
    fetchPasswords();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPassword = async (e) => {
    e.preventDefault();
    await api.post("/passwords/add", form);
    setForm({ platform: "", username: "", password: "" });
    fetchPasswords();
  };

  const deletePassword = async (id) => {
    await api.delete(`/passwords/delete/${id}`);
    fetchPasswords();
  };

  return (
    <div className="dashboard">
      <h2>Password Manager</h2>

      <form className="add-form" onSubmit={addPassword}>
        <input name="platform" placeholder="Platform" value={form.platform} onChange={handleChange} />
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button>Add</button>
      </form>

      {passwords.map((p) => (
        <div key={p.id} className="password-card">
          <p><strong>{p.platform}</strong></p>
          <p>{p.username}</p>
          <p>{p.password}</p>
          <button onClick={() => deletePassword(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
