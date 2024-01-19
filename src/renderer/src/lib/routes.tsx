import MainPageLayout from "@renderer/layouts/MainPageLayout";
import HomePage from "@renderer/pages/HomePage";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
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
]);
