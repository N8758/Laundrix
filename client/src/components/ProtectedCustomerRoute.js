// client/src/components/ProtectedCustomerRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedCustomerRoute({ children }) {
  const token = localStorage.getItem("customerToken");
  if (!token) return <Navigate to="/customer-login" replace />;
  return children;
}
