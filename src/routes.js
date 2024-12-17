/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Company from "views/examples/Company.js";
import UpdateCompanyInfo from "views/examples/UpdateCompanyInfo";
import VerifyPhone from "views/examples/PhoneVerification";
import CreateJobPosting from "views/examples/CreateJobPosting";
import EditJobPosting from "views/examples/EditJobPosting";
import Choose from "views/examples/ChooseMainCompany";
import Confirm from "views/examples/ConfirmInfo"



var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },

  {
    path: "/icons",
    name: "Tin tuyển dụng",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",

  },
  // {
  //   path: "/company",
  //   name: "Công ty",
  //   icon: "ni ni-planet text-blue",
  //   component: <Company />,
  //   layout: "/admin",
  // },
  {
    path: "/editCompanyInfo",
    name: "Quản lý tài khoản",
    icon: "ni ni-circle-08 text-pink",
    component: <UpdateCompanyInfo />,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/edit-job/:id",
    component: <EditJobPosting />,
    layout: "/admin",
  },
  {
    path: "/createJobPosting",
    component: <CreateJobPosting />,
    layout: "/admin",
  },
  {
    path: "/chooseMainCompany",
    component: <Choose />,
    layout: "/admin",
  },
  {
    path: "/verify-phone",
    component: <VerifyPhone />,
    layout: "/admin",
  },
  {
    path: "/cofirmInfo",
    component: <Confirm />,
    layout: "/admin",
  },

  {
    path: "/verify-company",
    component: <Company />,
    layout: "/admin",
  },

];
export default routes;
