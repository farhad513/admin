import { lazy } from "react";
const AllDoctor = lazy(() =>
  import("../../views/admin/AllDoctor")
);
const HospitalsDetails = lazy(() =>
  import("../../views/admin/HospitalsDetails")
);
const DeactiveHospitals = lazy(() =>
  import("../../views/admin/DeactiveHospitals")
);
const HospitalRequest = lazy(() => import("../../views/admin/HospitalRequest"));
const AdminDashboard = lazy(() => import("../../views/admin/AdminDashboard"));
const Appoinments = lazy(() => import("../../views/admin/Appoinments"));
const Category = lazy(() => import("../../views/admin/Category"));
const Hospitals = lazy(() => import("../../views/admin/Hospitals"));
const AppoinmentDetails = lazy(() => import("../../views/admin/AppoinmentDetails"));
const AddBlog = lazy(() => import("../../views/admin/AddBlog"));
const AllBlog = lazy(() => import("../../views/admin/AllBlog"));
const EditBlog = lazy(() => import("../../views/admin/EditBlog"));
const AddAmbulance = lazy(() => import("../../views/admin/AddAmbulance"));
const AllAmbulance = lazy(() => import("../../views/admin/AllAmbulance"));
const EditAmbulance = lazy(() => import("../../views/admin/EditAmbulance"));
const AllUsers = lazy(() => import("../../views/admin/AllUsers"));
const AmbulanceOrder = lazy(() => import("../../views/admin/AmbulanceOrder"));
const AmbulanceOrderDetails = lazy(() => import("../../views/admin/AmbulanceOrderDetails"));
const AllBanners = lazy(() => import("../../views/admin/AllBanners"));
const EditBanner = lazy(() => import("../../views/admin/EditBanner"));
const AddBanner = lazy(() => import("../../views/admin/AddBanner"));
const AllPrescription = lazy(() => import("../../views/admin/AllPrescription"));
export const adminRoutes = [
  {
    path: "admin/dashboard",
    element: <AdminDashboard />,
    role: "admin",
  },
  {
    path: "admin/dashboard/appoinments",
    element: <Appoinments />,
    role: "admin",
  },
  {
    path: "admin/dashboard/category",
    element: <Category />,
    role: "admin",
  },
  {
    path: "admin/dashboard/all-doctors",
    element: <AllDoctor />,
    role: "admin",
  },
  {
    path: "admin/dashboard/hospitals",
    element: <Hospitals />,
    role: "admin",
  },
  {
    path: "admin/dashboard/add-ambulance",
    element: <AddAmbulance />,
    role: "admin",
  },
  {
    path: "admin/dashboard/all-ambulance",
    element: <AllAmbulance />,
    role: "admin",
  },
  {
    path: "admin/dashboard/ambulance-order",
    element: <AmbulanceOrder />,
    role: "admin",
  },
  {
    path: "/admin/dashboard/ambulance/edit-ambulance/:ambulanceId",
    element: <EditAmbulance />,
    role: "admin",
  },
  {
    path: "/admin/dashboard/ambulance/view-ambulance/:ambulanceId",
    element: <AmbulanceOrderDetails />,
    role: "admin",
  },
  {
    path: "admin/dashboard/add-blog",
    element: <AddBlog />,
    role: "admin",
  },
  {
    path: "admin/dashboard/all-blog",
    element: <AllBlog />,
    role: "admin",
  },
  {
    path: "/admin/dashboard/blog/edit-blog/:blogId",
    element: <EditBlog />,
    role: "admin",
  },
    {
    path: "admin/dashboard/add-banner",
    element: <AddBanner />,
    role: "admin",
  },
    {
    path: "admin/dashboard/edit-banner/:id",
    element: <AddBanner />,
    role: "admin",
  },
  {
    path: "admin/dashboard/all-banners",
    element: <AllBanners />,
    role: "admin",
  },
  {
    path: "/admin/dashboard/blog/edit-banner/:bannerId",
    element: <EditBanner />,
    role: "admin",
  },
  {
    path: "admin/dashboard/deactive-hospitals",
    element: <DeactiveHospitals />,
    role: "admin",
  }, {
    path: "admin/dashboard/all-users",
    element: <AllUsers />,
    role: "admin",
  },
  {
    path: "admin/dashboard/hospitals-request",
    element: <HospitalRequest />,
    role: "admin",
  },
  {
    path: "admin/dashboard/hospital/details/:hospitalId",
    element: <HospitalsDetails />,
    role: "admin",
  },

  {
    path: "admin/dashboard/order/details/:orderId",
    element: <AppoinmentDetails />,
    role: "admin",
  },
  {
    path: "admin/dashboard/prescription-order",
    element: <AllPrescription />,
    role: "admin",
  },
];
