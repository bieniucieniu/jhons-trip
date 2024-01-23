import { Link, Redirect, Route, Switch } from "wouter";
import Root from "@/routes/root";
import Journey from "@/routes/journey";
import Browse from "./routes/browse";
import Login from "./routes/login";
import History from "./routes/history";
import { logout } from "./api/userAuth";
import { Card, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import useGetUser from "./api/queries/user";

export default function App() {
  const user = useGetUser();
  return (
    <>
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
          {user && user.data ? (
            <>
              <CardTitle>loged as {user?.data.username}</CardTitle>
              <Button
                onClick={() => {
                  logout();
                  user.refetch();
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
    </>
  );
}
