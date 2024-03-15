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
import useCapture from "./hooks/useCapture";
import CaptureWrapper from "./components/CaptureWrapper";
import { useInvite } from "./hooks/useInvite";

function App() {
  const [queryClient] = useState(() => new QueryClient(config));
  useDragDrop();
  useCapture();
  useInvite();

  return (
    <ThemeProvider>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <CaptureWrapper>
          <RouterProvider router={router} fallbackElement={<LoadingPage />} />
        </CaptureWrapper>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
