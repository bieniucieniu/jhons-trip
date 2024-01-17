import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route } from "wouter";

const queryClient = new QueryClient();

export default function Router() {
  return (
    <QueryClientProvider client={queryClient}>
      <Route path="/">dahdkasjldhak</Route>
    </QueryClientProvider>
  );
}
