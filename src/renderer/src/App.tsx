import { RouterProvider } from "react-router-dom";
import "./styles/global.css";
import "@mantine/core/styles.css";
import { router } from "./lib/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/theme";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} fallbackElement={null} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
