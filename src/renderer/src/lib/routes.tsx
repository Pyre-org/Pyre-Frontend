import AuthRoute from "@renderer/components/AuthRoute";
import MainPageLayout from "@renderer/layouts/MainPageLayout/MainPageLayout";
import ChannelsPage from "@renderer/pages/ChannelsPage";
import HomePage from "@renderer/pages/HomePage";
import LoginPage from "@renderer/pages/LoginPage";
import RegisterPage from "@renderer/pages/RegisterPage";
import { createHashRouter, Navigate } from "react-router-dom";

export const router = createHashRouter([
  {
    path: "/",
    element: <AuthRoute />,
    children: [
      {
        element: <MainPageLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" />,
          },
          {
            path: "home",
            element: <HomePage />,
          },
          {
            path: "channels",
            element: <ChannelsPage />,
          },
        ],
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
