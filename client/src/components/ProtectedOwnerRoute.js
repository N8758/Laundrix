import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedOwnerRoute({ children }) {
  const token = localStorage.getItem("ownerToken"); // FIXED !!!

  if (!token) {
    return <Navigate to="/owner-login" replace />;
  }

  return children;
}
