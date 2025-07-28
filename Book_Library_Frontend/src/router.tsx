import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Signup from "./pages/SignUpPage.tsx";
import Login from "./pages/LoginPage.tsx";
import AdminRoutes from "./pages/AdminRoutes.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import ReadersPage from "./pages/ReadersPage.tsx";
import LendingPage from "./pages/LendingPage.tsx";
import OverduePage from "./pages/OverduePage.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Navigate to="/login" /> },
            { path: "/login", element: <Login /> },
            { path: "/signup", element: <Signup /> },
            {
                element: <AdminRoutes />,
                children: [
                    { path: "/dashboard", element: <Dashboard /> },
                    { path: "/dashboard/books", element: <BooksPage /> },
                    { path: "/dashboard/readers", element: <ReadersPage />},
                    { path: "/dashboard/lending",element: <LendingPage />},
                    { path: "/dashboard/overdue", element: <OverduePage />},
                    { path: "/dashboard/profile",element: <UserProfilePage />}
                ],
            },
        ],

    },
]);

export default router;
