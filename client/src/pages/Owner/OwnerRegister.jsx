import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/ownerregister.css";

export default function OwnerRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ownerName: "",
    shopName: "",
    businessEmail: "",
    mobile: "",
    password: "",
    address: "",

    isOrganization: false,
    organizationName: "",
    organizationHeadNumber: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let finalValue = value;

    // Allow only numbers in mobile fields
    if (
      name === "mobile" ||
      name === "organizationHeadNumber"
    ) {
      finalValue = value.replace(/\D/g, "");
    }

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? checked
          : finalValue
    });
  };

  const registerOwner = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/owner/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      // Backend errors
      if (!res.ok) {
        alert(data.message);
        return;
      }

      // Clear form after success
      setForm({
        ownerName: "",
        shopName: "",
        businessEmail: "",
        mobile: "",
        password: "",
        address: "",

        isOrganization: false,
        organizationName: "",
        organizationHeadNumber: ""
      });

      alert(
        "Registration successful! Please wait for admin approval."
      );

      navigate("/");

    } catch (error) {
      console.log(error);
      alert("Registration failed");
    }
  };

  return (
    <div className="owner-register-container">
      <h2>Owner Register</h2>

      <input
        name="ownerName"
        type="text"
        placeholder="Owner Name"
        value={form.ownerName}
        onChange={handleChange}
        className="owner-register-input"
        pattern="[A-Za-z ]+"
        title="Only letters allowed"
      />

      <input
        name="shopName"
        type="text"
        placeholder="Shop Name"
        value={form.shopName}
        onChange={handleChange}
        className="owner-register-input"
      />

      <input
        name="businessEmail"
        type="email"
        placeholder="Business Email"
        value={form.businessEmail}
        onChange={handleChange}
        className="owner-register-input"
      />

      <input
        name="mobile"
        type="text"
        placeholder="Mobile Number (91xxxxxxxxxx)"
        value={form.mobile}
        onChange={handleChange}
        className="owner-register-input"
        maxLength={12}
      />

      <input
        name="password"
        type="password"
        placeholder="Password (6-10 characters)"
        value={form.password}
        onChange={handleChange}
        className="owner-register-input"
        minLength={6}
        maxLength={10}
      />

      <input
        name="address"
        type="text"
        placeholder="Full Address (Shop/House, Area, City, State)"
        value={form.address}
        onChange={handleChange}
        className="owner-register-input"
        minLength={15}
      />

      {/* <label className="owner-register-checkbox">
        <input
          type="checkbox"
          name="isOrganization"
          checked={form.isOrganization}
          onChange={handleChange}
        />

        Organization Business
      </label> */}

      {form.isOrganization && (
        <>
          <input
            name="organizationName"
            type="text"
            placeholder="Organization Name"
            value={form.organizationName}
            onChange={handleChange}
            className="owner-register-input"
          />

          <input
            name="organizationHeadNumber"
            type="text"
            placeholder="Organization Head Number (91xxxxxxxxxx)"
            value={form.organizationHeadNumber}
            onChange={handleChange}
            className="owner-register-input"
            maxLength={12}
          />
        </>
      )}

      <button
  className="owner-register-btn"
  onClick={registerOwner}
>
        Register
      </button>
    </div>
  );
}

