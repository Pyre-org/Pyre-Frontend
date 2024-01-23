import { RouterProvider } from "react-router-dom";
import "./styles/global.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { router } from "./lib/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";
import { config } from "./lib/queryclient";
import { Notifications } from "@mantine/notifications";

function App() {
  const [queryClient] = useState(() => new QueryClient(config));
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} fallbackElement={null} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
