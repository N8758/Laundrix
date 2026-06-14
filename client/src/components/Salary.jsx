import { useEffect, useState } from "react";
import axios from "axios";
import "./Salary.css";

export default function Salary() {

  const API = process.env.REACT_APP_API_URL;

  const [salaryList, setSalaryList] = useState([]);

  // ✅ Get Staff
  const staff = JSON.parse(
    localStorage.getItem("staff")
  );

  const staffId = staff?.id;

  // ✅ Fetch Salary
  useEffect(() => {

    if (!staffId) {
      console.error("❌ Staff ID missing");
      return;
    }

    axios
      .get(`${API}/api/salary/staff/${staffId}`)

      .then((res) => {
        setSalaryList(res.data);
      })

      .catch((err) => {
        console.error(
          "❌ Salary fetch error:",
          err
        );
      });

  }, [staffId, API]);

  return (

    <div className="salary-container">

      <h2 className="salary-title">
        💰 My Salary
      </h2>

      {salaryList.length === 0 ? (

        <div className="no-salary">
          No salary found
        </div>

      ) : (

        salaryList.map((s) => (

          <div
            key={s.id}
            className="salary-card"
          >

            <p>
              <b>Month:</b> {s.month}/{s.year}
            </p>

            {/* <p>
              <b>Present Days:</b>{" "}
              {s.present_days}
            </p>

            <p>
              <b>Absent Days:</b>{" "}
              {s.absent_days}
            </p> */}

            <p className="salary-amount">
              ₹{s.final_salary}
            </p>

          </div>

        ))

      )}

    </div>
  );
}