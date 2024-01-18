import { RouterProvider } from "react-router-dom";
import "./styles/global.css";
import { router } from "./lib/routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

function App() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} fallbackElement={null} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
