import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import Root from "@/routes/root";
import Journey from "@/routes/journey";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Root} />
        <Route path="/journey/:id" component={Journey} />
        <Route>
          <main className="flex justify-center items-center">404</main>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}
