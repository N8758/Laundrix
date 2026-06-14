import { Navigate } from "react-router-dom";

export default function ProtectedStaffRoute({ children }) {
  const staff = localStorage.getItem("staff");

  if (!staff) {
    return <Navigate to="/staff-login" />;
  }

  return children;
}