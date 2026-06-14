import { useEffect, useState } from "react";
import axios from "axios";
import "./style/OwnerSalary.css";
export default function OwnerSalary({ ownerId }) {
  const API = process.env.REACT_APP_API_URL;

  const [staffList, setStaffList] = useState([]);
  const [salaryList, setSalaryList] = useState([]);
  const [form, setForm] = useState({
    staff_id: "",
    month: "",
    year: "",
    base_salary: "",
    incentive: "",
  });

  const [loading, setLoading] = useState(false);

  const fetchSalary = async () => {
  try {
    const res = await axios.get(`${API}/api/salary/owner/${ownerId}`);
    setSalaryList(res.data);
  } catch (err) {
    console.error("❌ Salary fetch error:", err);
    setSalaryList([]);
  }
};

  // ✅ Fetch staff using ownerId (UUID)
  useEffect(() => {
    if (!ownerId) {
      console.error("❌ Owner ID missing");
      return;
    }

  
      axios.get(`${API}/api/owner/staff/${ownerId}`)
      .then((res) => {
        console.log("✅ STAFF:", res.data);

        // Safety check (important)
        if (Array.isArray(res.data)) {
          setStaffList(res.data);
        } else {
          setStaffList([]);
        }
      })
      .catch((err) => {
        console.error("❌ Staff fetch error:", err);
        setStaffList([]);
      });
      
      fetchSalary();
  }, [API, ownerId]);



  

  // ✅ Handle date (split month/year)
  const handleDate = (e) => {
    const [year, month] = e.target.value.split("-");
    setForm((prev) => ({
      ...prev,
      month,
      year,
    }));
  };

  // ✅ Generate salary
  const generateSalary = async () => {
    if (!form.staff_id || !form.month || !form.year || !form.base_salary) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/api/salary/generate`, {
        staff_id: Number(form.staff_id),
        month: Number(form.month),
        year: Number(form.year),
        base_salary: Number(form.base_salary),
        incentive: Number(form.incentive || 0),
      });

      alert("✅ Salary Generated Successfully");
      fetchSalary();

      // Reset form
      setForm({
        staff_id: "",
        month: "",
        year: "",
        base_salary: "",
        incentive: "",
      });

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "❌ Error generating salary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-salary-container">
      <h2 className="salary-title">💰 Salary Management</h2>

      <div className="salary-form">
        {/* ✅ Staff Dropdown */}
        <select
          value={form.staff_id}
          onChange={(e) =>
            setForm({ ...form, staff_id: e.target.value })
          }
        >
          <option value="">Select Staff</option>

          {Array.isArray(staffList) &&
            staffList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </select>

        {/* ✅ Date */}
        <input type="month" onChange={handleDate} />

        {/* ✅ Base Salary */}
        <input
          type="number"
          placeholder="Base Salary"
          value={form.base_salary}
          onChange={(e) =>
            setForm({ ...form, base_salary: e.target.value })
          }
        />

        {/* ✅ Incentive */}
        <input
          type="number"
          placeholder="Incentive (optional)"
          value={form.incentive}
          onChange={(e) =>
            setForm({ ...form, incentive: e.target.value })
          }
        />

        {/* ✅ Button */}
        <button
  className="salary-btn"
  onClick={generateSalary}
  disabled={loading}
>
          {loading ? "Generating..." : "Generate Salary"}
        </button>


        <h3 className="salary-subtitle">Generated Salaries</h3>

{salaryList.length === 0 && <p className="no-salary">No salary generated</p>}

{salaryList.map((s) => (
  <div key={s.id} className="salary-card">
    <p><b>Staff:</b> {s.name}</p>
    <p><b>Month:</b> {s.month}/{s.year}</p>
    <p><b>Salary:</b> ₹{s.final_salary}</p>
  </div>
))}
      </div>
    </div>
    
  );
}