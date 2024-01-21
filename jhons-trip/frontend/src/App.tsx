import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Redirect, Route, Switch } from "wouter";
import Root from "@/routes/root";
import Journey from "@/routes/journey";
import Browse from "./routes/browse";
import Login from "./routes/login";
import History from "./routes/history";
import { useEffect, useState } from "react";
import { getUser, logout } from "./api/userAuth";
import { Card, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

export default function App() {
  const [user, setUser] =
    useState<Partial<Awaited<ReturnType<typeof getUser>>>>(undefined);
  useEffect(() => {
    getUser((u) => setUser(u));
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Root} />
        <Route path="/journey/:id" component={Journey} />
        <Route path="/browse/:page" component={Browse} />
        <Route path="/browse">
          <Redirect to="/browse/1" />;
        </Route>
        <Route path="/login" component={Login} />
        <Route path="/history" component={History} />
        <Route>
          <main className="flex justify-center items-center">404</main>
        </Route>
      </Switch>
      <Card className="absolute top-0 right-0 rounded-r-none rounded-t-none">
        <CardHeader>
          {user ? (
            <>
              <CardTitle>loged as {user?.user?.username}</CardTitle>
              <Button
                onClick={() => {
                  logout();
                  setUser(undefined);
                }}
              >
                logout
              </Button>
            </>
          ) : (
            <Button variant="link">
              <Link href="/login">login/signin</Link>
            </Button>
          )}
        </CardHeader>
      </Card>
    </QueryClientProvider>
  );
}
