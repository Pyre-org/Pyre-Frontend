import MainPageLayout from "@renderer/layouts/MainPageLayout";
import HomePage from "@renderer/pages/HomePage";
import LoginPage from "@renderer/pages/LoginPage";
import RegisterPage from "@renderer/pages/RegisterPage";
import { createHashRouter, Navigate } from "react-router-dom";

export const router = createHashRouter([
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    element: <MainPageLayout />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
