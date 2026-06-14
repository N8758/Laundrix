import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import "./style/OwnerCharts.css";

const PIE_COLORS = ["#FF9800", "#4CAF50"];

export default function OwnerCharts({ ownerId }) {
  const [bookings, setBookings] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [statusStats, setStatusStats] = useState([]);

  useEffect(() => {
    if (!ownerId) return;
    loadBookings();
  }, [ownerId]);

  const loadBookings = async () => {
   const res = await fetch(
  `${process.env.REACT_APP_API_URL}/api/booking/owner/${ownerId}`
);
    const data = await res.json();
    const list = data.bookings || [];
    console.log(list);
    setBookings(list);
    buildDailyStats(list);
    buildStatusStats(list);
  };

  const buildDailyStats = (list) => {
    const map = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map[key] = { date: key, revenue: 0, bookings: 0 };
    }
    list.forEach(b => {
  if (b.status !== "completed") return;

  const day = b.completionDateTime
    ? b.completionDateTime.slice(0, 10)
    : b.createdAt?.slice(0, 10);

  if (map[day]) {
    map[day].bookings += 1;

    const price = parseFloat(b.totalPrice);
    map[day].revenue += isNaN(price) ? 0 : price;
  }
});
    setDailyStats(Object.values(map));
  };

  const buildStatusStats = (list) => {
  let pending = 0;
  let confirmed = 0;

  list.forEach(b => {
    switch (b.status) {
      case "confirmed":
      case "completed":
        confirmed++;
        break;

      case "pending":
      case "assigned":
      case "processing":
      case "accepted":
      default:
        pending++;
    }
  });

  setStatusStats([
    { name: "Pending", value: pending },
    { name: "Confirmed", value: confirmed }
  ]);
};

  const exportCSV = () => {
    if (!bookings.length) return alert("No data to export");

    const headers = [
      "Booking ID", "Service", "Customer", "Mobile",
      "Address", "Total", "Status", "Pickup Time", "Created At"
    ];

    const rows = bookings.map(b => [
      b.id, b.serviceName, b.customerName, b.customerMobile,
      b.customerAddress, b.totalPrice, b.status,
      b.pickupDateTime || "", b.createdAt
    ]);

    const csv =
      headers.join(",") + "\n" +
      rows.map(r => r.map(v => `"${v ?? ""}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `owner-${ownerId}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Summary totals ── */
  const totalRevenue = bookings.reduce((sum, b) => {
  const price = parseFloat(b.totalPrice);
  return sum + (isNaN(price) ? 0 : price);
}, 0);
  const totalConfirmed = statusStats.find(s => s.name === "Confirmed")?.value || 0;
  const totalPending = statusStats.find(s => s.name === "Pending")?.value || 0;

  if (!bookings.length) {
    return (
      <div className="charts-empty">
        <span>📊</span>
        No analytics data yet
      </div>
    );
  }

  return (
    <div className="charts-container">
      <h3 className="charts-heading">Owner Analytics</h3>

      {/* ── Summary Row ── */}
      <div className="charts-stats-row">
        <div className="charts-stat-card">
          <span className="charts-stat-label">Total Bookings</span>
          <span className="charts-stat-value">{bookings.length}</span>
        </div>
        <div className="charts-stat-card">
          <span className="charts-stat-label">Total Revenue</span>
          <span className="charts-stat-value">₹{totalRevenue.toLocaleString()}</span>
        </div>
        <div className="charts-stat-card">
          <span className="charts-stat-label">Confirmed</span>
          <span className="charts-stat-value">{totalConfirmed}</span>
        </div>
        <div className="charts-stat-card">
          <span className="charts-stat-label">Pending</span>
          <span className="charts-stat-value">{totalPending}</span>
        </div>
      </div>

      {/* ── Pie Chart ── */}
      <div className="chart-card">
        <p className="chart-card-title">Order Status</p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusStats}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {statusStats.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ── Revenue Line Chart ── */}
      <div className="chart-card">
        <p className="chart-card-title">Revenue — Last 7 Days</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3a6ff7"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bookings Bar Chart ── */}
      <div className="chart-card">
        <p className="chart-card-title">Daily Bookings</p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="bookings" fill="#4CAF50" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Export ── */}
      <button className="btn-export-csv" onClick={exportCSV}>
        📤 Export CSV Report
      </button>
    </div>
  );
}