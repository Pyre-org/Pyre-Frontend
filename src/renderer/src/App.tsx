import { RouterProvider } from "react-router-dom";
import "./styles/global.css";
import { router } from "./lib/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { config } from "./lib/queryclient";
import LoadingPage from "./pages/LoadingPage";
import { ThemeProvider } from "@renderer/components/common/ThemeProvider";
import { Toaster } from "sonner";
import { useDragDrop } from "./hooks/useDragDrop";

function App() {
  const [queryClient] = useState(() => new QueryClient(config));
  useDragDrop();

  return (
    <ThemeProvider>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} fallbackElement={<LoadingPage />} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
