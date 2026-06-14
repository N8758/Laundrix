import React from "react";
import { useNavigate } from "react-router-dom";
import SignupModal from "./SignupModal";

export default function SignupPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div>
      <SignupModal closeModal={handleClose} />
    </div>
  );
}