import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout";
import About from "./pages/About/About";
import FindDoctors from "./pages/FindDoctors";
import HealthPackages from "./pages/HealthPackages/HealthPackages";
import Login from "./pages/Login/Login";
import SignIn from "./pages/Login/SignIn";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorPage from "./pages/FIndDoctors/DoctorPage";
import DocProfile from "./pages/FIndDoctors/DocProfile";
import UserDashboard from "./pages/User/UserDashboard";
import Protected from "./components/Protected";
import UserAppointments from "./pages/User/UserAppointments";
import Favorites from "./pages/User/Favorites";
import ProfileSettings from "./pages/User/ProfileSettings";
import ChangePassword from "./pages/User/ChangePassword";
import UserLayout from "./components/UserLayout";
import AdminDashboard from "./pages/Admin/DashBoard/AdminDashboard";
import AdminHome from "./pages/Admin/AdminPages/AdminHome";
import Appointments from "./pages/Doctor/DoctorPages/DoctorAppointments";
import AddDoctor from "./pages/Admin/AdminPages/AddDoctor";
import DoctorList from "./pages/Admin/AdminPages/DoctorList";
import Patients from "./pages/Admin/AdminPages/Patients";
import DoctorDashboard from "./pages/Doctor/DashBoard/DoctorDashboard";
import DoctorHome from "./pages/Doctor/DoctorPages/DoctorHome";
import DoctorAppointments from "./pages/Doctor/DoctorPages/DoctorAppointments";
import UpdateProfile from "./pages/Doctor/DoctorPages/UpdateProfile";
import Schedule from "./pages/Doctor/DoctorPages/Schedule";
import RecomendedDoctors from "./pages/Recommended/RecomendedDoctors";
import { Toaster } from "./components/ui/toaster";
import Specializations from "./pages/Admin/AdminPages/Specializations";
import ChangePasswordDoctor from "./pages/Doctor/DoctorPages/ChangePasswordDoctor";
import NearbyDoctors from "./pages/FIndDoctors/NearbyDoctors";
import AdminProfileUpdate from "./pages/Admin/AdminPages/AdminProfileUpdate";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/adminDashboard"
        element={
          <Protected>
            <AdminDashboard />
          </Protected>
        }
      >
        <Route index element={<AddDoctor />} />
        <Route path="addDoctors" element={<AddDoctor />} />
        <Route path="doctorList" element={<DoctorList />} />
        <Route path="patients" element={<Patients />} />
        <Route path="specializations" element={<Specializations />} />
        <Route path="updateProfile" element={<AdminProfileUpdate/>}/>
      </Route>
      <Route
        path="/doctorDashboard"
        element={
          <Protected>
            <DoctorDashboard />
          </Protected>
        }
      >
        <Route index element={<DoctorAppointments />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="updateProfile" element={<UpdateProfile/>}/>
        <Route path="schedule" element={<Schedule/>} />
        <Route path="changePassword" element={<ChangePasswordDoctor/>}/>
      </Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="findDoctors" element={<DoctorPage />} />
        <Route path="finddoc" element={<FindDoctors />} />
        <Route path="findDoctors/:id" element={<DocProfile />} />
        <Route path="recommendedDoctors" element={<RecomendedDoctors/>} />
        <Route path="healthPackages" element={<HealthPackages />} />
        <Route path="login" element={<Login />} />
        <Route path="signin" element={<SignIn />} />
        <Route path="nearbyDoctors" element={<NearbyDoctors />} />
        <Route
          path="userDashboard"
          element={
            <Protected>
              <UserLayout />
            </Protected>
          }
        >
          {/* <Route index element={<UserDashboard/>}/> */}
          <Route index element={<UserAppointments />} />

          <Route path="appointments" element={<UserAppointments />} />
          <Route path="favorite" element={<Favorites />} />
          <Route path="profileSettings" element={<ProfileSettings />} />
          <Route path="changePassword" element={<ChangePassword />} />
        </Route>
      </Route>
    </>
  )
);

function App() {
  return (
    <>
    <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
