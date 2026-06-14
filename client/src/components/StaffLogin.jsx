import { useState } from "react";
import axios from "axios";

export default function StaffLogin() {
  const [form, setForm] = useState({
    staff_id: "",
    mobile: "",
    owner_id: ""
  });

  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle login
  const handleLogin = async () => {
    // ✅ basic validation
    if (!form.staff_id || !form.mobile || !form.owner_id) {
      alert("All fields are required");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
  alert("Enter valid 10 digit mobile number");
  return;
}

    try {
      setLoading(true);

      // ✅ use env (NO HARDCODE)
      const API = process.env.REACT_APP_API_URL;

      const res = await axios.post(
        `${API}/api/owner/staff/login`,
        form
      );

      alert("Login Successful ✅");

      // save staff data
      localStorage.setItem("staff", JSON.stringify(res.data.staff));

      // redirect
      window.location.href = "/staff-dashboard";

    } catch (err) {
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Staff Login</h2>

      <input
        type="text"
        name="staff_id"
        placeholder="Enter Staff ID"
        value={form.staff_id}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="text"
        name="mobile"
        placeholder="Enter Mobile Number"
        value={form.mobile}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        type="text"
        name="owner_id"
        placeholder="Enter Laundry ID"
        value={form.owner_id}
        onChange={handleChange}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

// simple styles
const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    fontSize: "14px"
  },
  button: {
    padding: "10px",
    background: "blue",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};