import CellDashboard from "./views/admin/Cell_Info.tsx";
import AdminNav from "./components/AdminNav.tsx";
import Sidebar from "./components/Sidebar.tsx";
import "./App.css";
import AddOpportunity from "./views/admin/AddOpportunity.tsx";
import AddTestmony from "./views/admin/AddTestmony.tsx";
import Profile from "./views/admin/Profile.tsx";
import Testmonials from "./views/Testmonials.tsx";
import Testimonials from "./views/partials/Testmonials.tsx";
import { Route, Routes } from "react-router-dom";
import Index from "./views/Index.tsx";
import Statistics from "./views/Statistics.tsx";
import Login from "./views/auth/login.tsx";
import Opp from "./views/Opp.tsx";
import Dashboard from "./views/admin/Dashboard.tsx";
import UsersView from "./views/admin/UsersView.tsx";
import CreateUser from "./views/admin/CreateUser.tsx";
import ViewUser from "./views/admin/ViewUser.tsx";
import ReportCase from "./views/admin/ReportCase.tsx";
import ReviewChild from "./views/admin/ReviewChild.tsx";
import ReviewCase from "./views/admin/ReviewCase.tsx";
import FamiliesView from "./views/admin/FamiliesView.tsx";
import ReviewFamily from "./views/admin/ReviewFamily.tsx";
import FamilyChild from "./views/admin/FamilyChild.tsx";
import Cases from "./views/admin/Cases.tsx";
import Children from "./views/admin/Children.tsx";
import ReviewTestmony from "./views/admin/ReviewTestmony.tsx";
import ReviewOpportunity from "./views/admin/ReviewOpportunity.tsx";
import Opportunities from "./views/partials/Opportunities.tsx";
import ChangePAssword from "./views/auth/changePassword.tsx";
import Testimonial from "./views/Testimonial.tsx";
import RehabDashboard from "./views/admin/RehabDashboard.tsx";
import Rehabilitated from "./views/admin/Rehabilitated.tsx";

export default function App() {
  console.log("App Component Rendered");

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/testmonials" element={<Testmonials />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/auth" element={<Login />} />
        <Route path="/change-password/:uuid" element={<ChangePAssword />} />
        <Route path="/opps/:opp" element={<Opp />} />
        <Route path="/testimonials/:testimonial" element={<Testimonial />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/rehab/*" element={<RehabRoutes />} />
      </Routes>
    </div>
  );
}

function AdminRoutes() {

  const userPrivilege = localStorage.getItem("user_privilege");

  return (
    <div className="">
      <AdminNav />
      <div className="bady">
       {userPrivilege != 'rehab' ? <Sidebar /> : <></> }
       <div className={`${userPrivilege !== 'rehab' ? 'body-content p-3' : 'py-4 px-5'} w-full`}>
       <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<UsersView />} />
            <Route path="/new-user" element={<CreateUser />} />
            <Route path="/view-user/:user" element={<ViewUser />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/children" element={<Children />} />
            <Route path="/report-case" element={<ReportCase />} />
            <Route path="/child/:child" element={<ReviewChild />} />
            <Route path="/case/:caseId" element={<ReviewCase />} />
            <Route path="/families" element={<FamiliesView />} />
            <Route path="/family/:id" element={<ReviewFamily />} />
            <Route path="/family-child" element={<FamilyChild />} />
            <Route path="/cells/:cell" element={<CellDashboard />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/opps" element={<Opportunities />} />
            <Route
              path="/testimonials/add-testmony"
              element={<AddTestmony />}
            />
            <Route path="/opps/add-opportunity" element={<AddOpportunity />} />
            <Route path="/add-opportunity" element={<AddOpportunity />} />
            <Route path="/testimonials/:id" element={<ReviewTestmony />} />
            <Route path="/opps/:id" element={<ReviewOpportunity />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function RehabRoutes() {
  return (
    <div className="">
      <AdminNav />
      <div className="bady">
        <Routes>
          <Route path="/dashboard" element={<RehabDashboard />} />
          <Route path="/child/:child" element={<ReviewChild />} />
          <Route path="/rehabilitated" element={<Rehabilitated />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}
