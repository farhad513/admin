import { lazy } from 'react'
const AddBanner = lazy(() => import("../../views/hospital/AddBanner"))
const Banners = lazy(() => import("../../views/hospital/Banners"))
const HospitalDashboard = lazy(() => import("../../views/hospital/HospitalDashboard"))
const AddDoctor = lazy(() => import("../../views/hospital/AddDoctor"))
const Doctors = lazy(() => import("../../views/hospital/Doctors"))
const Appoinments = lazy(() => import("../../views/hospital/Appoinments"))
const Payments = lazy(() => import("../../views/hospital/Payments"))
const HospitalToAdmin = lazy(() => import("../../views/hospital/HospitalToAdmin"))
const HospitalToCustomer = lazy(() => import("../../views/hospital/HospitalToCustomer"))
const Profile = lazy(() => import("../../views/hospital/Profile"))
const EditDoctor = lazy(() => import("../../views/hospital/EditDoctor"))
const AppoinmentDetails = lazy(() => import("../../views/hospital/AppoinmentDetails"))
const Pending = lazy(() => import("../../views/Pending"))
const Deactive = lazy(() => import("../../views/Deactive"))
export const hospitalRoutes = [

    {
        path: '/hospital/account-pending',
        element: <Pending />,
        ability: 'hospital'
    },
    {
        path: '/hospital/account-deactive',
        element: <Deactive />,
        ability: 'hospital'
    },

    {
        path: '/hospital/dashboard',
        element: <HospitalDashboard />,
        role: 'hospital',
        status: 'active'
    },

    {
        path: '/hospital/dashboard/add-doctor',
        element: <AddDoctor />,
        role: 'hospital',
        status: 'active'
    },
    {
        path: '/hospital/dashboard/edit-doctor/:doctorId',
        element: <EditDoctor />,
        role: 'hospital',
        status: 'active'
    },
    {
        path: '/hospital/dashboard/doctors',
        element: <Doctors />,
        role: 'hospital',
        status: 'active'
    },

   
    {
        path: '/hospital/dashboard/appoinments',
        element: <Appoinments />,
        role: 'hospital',
        visibility: ['active', 'deactive']
    },
    
    {
        path: '/hospital/dashboard/appoinment/details/:appoinmentId',
        element: <AppoinmentDetails />,
        role: 'hospital',
        visibility: ['active', 'deactive']
    },
    // {
    //     path: '/seller/dashboard/payments',
    //     element: <Payments />,
    //     role: 'seller',
    //     status: 'active'
    // },
    {
        path: '/hospital/dashboard/chat-support',
        element: <HospitalToAdmin />,
        role: 'hospital',
        visibility: ['active', 'deactive', 'pending']
    },
    {
        path: '/hospital/dashboard/chat-customer/:customerId',
        element: <HospitalToCustomer />,
        role: 'hospital',
        status: 'active'
    },
    {
        path: '/hospital/dashboard/chat-customer',
        element: <HospitalToCustomer />,
        role: 'hospital',
        status: 'active'
    },
    {
        path: '/hospital/dashboard/profile',
        element: <Profile />,
        role: 'hospital',
        visibility: ['active', 'deactive', 'pending']
    },
    {
        path: '/hospital/dashboard/add-banner/:productId',
        element: <AddBanner />,
        role: 'hospital',
        status: 'active'
    },
    {
        path: '/hospital/dashboard/banners',
        element: <Banners />,
        role: 'hospital',
        status: 'active'
    },
]