import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Route, Switch } from "wouter";
import Root from "@/routes/root";
import Journey from "@/routes/journey";
import Browse from "./routes/browse";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Root} />
        <Route path="/journey/:id" component={Journey} />
        <Route path="/browse/:page" component={Browse} />
        <Route path="/browse">
          <Redirect to="/browse/1" />;
        </Route>
        <Route>
          <main className="flex justify-center items-center">404</main>
        </Route>
      </Switch>
    </QueryClientProvider>
  );
}
