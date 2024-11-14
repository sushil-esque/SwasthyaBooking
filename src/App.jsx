import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout";
import About from "./pages/About/About";
import FindDoctors from "./pages/FindDoctors";
import HealthPackages from "./pages/HealthPackages/HealthPackages";
import Login from "./pages/Login/Login"
import SignIn from "./pages/Login/SignIn";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorPage from "./pages/FIndDoctors/DoctorPage";
import DocProfile from "./pages/FIndDoctors/DocProfile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
      <Route index element={<Home/>}/>
      <Route path="home" element={<Home />} />
      <Route path="about" element={<About/>}/>
      <Route path="findDoctors" element={<DoctorPage/>}/>
      <Route path="finddoc" element={<FindDoctors/>}/>
      <Route path="findDoctors/:id" element={<DocProfile/>}/>

      <Route path="healthPackages" element={<HealthPackages/>}/>
      <Route path="login" element={<Login/>}/>
      <Route path="signin" element={<SignIn/>}/>



    </Route>
  )
)
// ([
//   {
//     path: "/",
//     children: [
//       {
//         path: "/",
//         element: <Home />,
//       },
//       {
//         path: "/home",
//         element: <Home />,
//       },
//       {
//         path: "/about",
//         element: <About />,
//       },
//       {
//         path: "/findDoctors",
//         element: <FindDoctors />,
//       },
//       {
//         path: "/healthPackages",
//         element: <HealthPackages />,
//       },
//       {
//         path: "/login",
//         element: <Login/>
//       }
//     ],
//     element: <Layout/>,
//   },
// ]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
