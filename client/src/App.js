import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import PendingOwners from "./pages/Admin/PendingOwners";
import ApprovedOwners from "./pages/Admin/ApprovedOwners";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedOwnerRoute from "./components/ProtectedOwnerRoute";

import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import OwnerLogin from "./pages/Owner/OwnerLogin";


import OrganizationLogin from "./pages/Owner/OrganizationLogin";
import OrganizationDashboard from "./pages/Owner/OrganizationDashboard";




import CustomerLogin from "./pages/Customer/CustomerLogin";
import CustomerOTP from "./pages/Customer/CustomerOTP";
import ScanOwner from "./pages/Customer/ScanOwner";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import ProtectedCustomerRoute from "./components/ProtectedCustomerRoute";


import StaffLogin from "./components/StaffLogin";
import StaffDashboard from "./components/StaffDashboard";
import ProtectedStaffRoute from "./components/ProtectedStaffRoute";


import CustomerProfile from "./pages/Customer/CustomerProfile";

import SignupPage from "./components/SignupPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* OWNER */}
        <Route path="/owner-login" element={<OwnerLogin />} />

        <Route 
          path="/owner-dashboard"
          element={
            <ProtectedOwnerRoute>
              <OwnerDashboard />
            </ProtectedOwnerRoute>
          }
        />

        {/* CUSTOMER */}
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/customer-otp" element={<CustomerOTP />} />

        <Route 
          path="/customer-scan"
          element={
            <ProtectedCustomerRoute>
              <ScanOwner />
            </ProtectedCustomerRoute>
          }
        />

        <Route 
          path="/customer-dashboard/"
          element={
            <ProtectedCustomerRoute>
              <CustomerDashboard />
            </ProtectedCustomerRoute>
          }
        />


        {/* LANDING */}
        <Route path="/" element={<LandingPage />} />
        <Route
  path="/signup"
  element={<SignupPage />}
/>

        {/* ADMIN */}
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />

        <Route
          path="/admin/pending"
          element={
            <ProtectedAdminRoute>
              <PendingOwners />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/approved"
          element={
            <ProtectedAdminRoute>
              <ApprovedOwners />
            </ProtectedAdminRoute>
          }
        />


        {/* STAFF */}
<Route path="/staff-login" element={<StaffLogin />} />

<Route
  path="/staff-dashboard"
  element={
    <ProtectedStaffRoute>
      <StaffDashboard />
    </ProtectedStaffRoute>
  }
/>


<Route 
  path="/customer/profile"
  element={
    <ProtectedCustomerRoute>
      <CustomerProfile />
    </ProtectedCustomerRoute>
  }
/>





{/* ORGANIZATION */}

<Route
path="/organization-login"
element={<OrganizationLogin />}
/>

<Route
path="/organization-dashboard"
element={<OrganizationDashboard />}
/>



      



      </Routes>
    </BrowserRouter>
  );
}

export default App;
