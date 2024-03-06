import AuthRoute from "@renderer/components/common/AuthRoute";
import MainPageLayout from "@renderer/layouts/MainPageLayout/MainPageLayout";
import ChannelDetailPage from "@renderer/pages/ChannelDetailPage";
import ChannelsPage from "@renderer/pages/ChannelsPage";
import HomePage from "@renderer/pages/HomePage";
import LoginPage from "@renderer/pages/LoginPage";
import OAuthPage from "@renderer/pages/OAuthPage";
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
                element: <ChannelDetailPage />,
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
    path: "/oauth/callback/:authority",
    element: <OAuthPage />,
  },
]);
