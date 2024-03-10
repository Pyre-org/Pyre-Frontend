import AuthRoute from "@renderer/components/common/AuthRoute";
import MainPageLayout from "@renderer/layouts/MainPageLayout/MainPageLayout";
import ChannelsPage from "@renderer/pages/ChannelsPage";
import HomePage from "@renderer/pages/HomePage";
import LoginPage from "@renderer/pages/LoginPage";
import PublicRoomListPage from "@renderer/pages/PublicRoomListPage";
import RegisterPage from "@renderer/pages/RegisterPage";
import RoomInfoPage from "@renderer/pages/RoomInfoPage";
import SpaceDetailPage from "@renderer/pages/SpaceDetailPage";
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
                children: [
                  {
                    index: true,
                    element: <PublicRoomListPage />,
                  },
                  {
                    path: "rooms",
                    children: [
                      {
                        path: ":roomId",
                        children: [
                          {
                            path: "spaces",
                            children: [
                              {
                                path: ":spaceId",
                                element: <SpaceDetailPage />,
                              },
                            ],
                          },
                          {
                            path: "info",
                            element: <RoomInfoPage />,
                          },
                        ],
                      },
                    ],
                  },
                ],
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
