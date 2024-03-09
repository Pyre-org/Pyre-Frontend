import AuthRoute from "@renderer/components/common/AuthRoute";
import MainPageLayout from "@renderer/layouts/MainPageLayout/MainPageLayout";
import ChannelsPage from "@renderer/pages/ChannelsPage";
import HomePage from "@renderer/pages/HomePage";
import LoginPage from "@renderer/pages/LoginPage";
import PublicRoomListPage from "@renderer/pages/PublicRoomListPage";
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
            children: [
              {
                index: true,
                element: <ChannelsPage />,
              },
              {
                path: ":channelId",
                element: <PublicRoomListPage />,
              },
            ],
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
  {
    path: "*",
    element: <div>Not found</div>,
  },
]);
