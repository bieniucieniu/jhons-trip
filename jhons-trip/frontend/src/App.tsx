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
import Banner from "./components/banner";

export default function App() {
  const user = useGetUser();
  return (
    <div className="pt-[160px]">
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
      <Card className="fixed top-0 right-0 left-0 rounded-r-none rounded-t-none">
        <CardHeader className="flex flex-row justify-between">
          <nav className="flex gap-x-6 flex-wrap items-center">
            <Link href="/">
              <a>
                <Banner className="select-none" />
              </a>
            </Link>
            <Link href="/browse" className="text-2xl text-bold hover:underline">
              all journeys
            </Link>
          </nav>
          {user && user.data ? (
            <div className="flex flex-col gap-y-1">
              <CardTitle className="mx-auto">
                loged as {user?.data.username}
              </CardTitle>
              <Button variant="link">
                <Link href="/history">history of booking</Link>
              </Button>
              <Button
                onClick={() => {
                  logout();
                  user.refetch();
                }}
              >
                logout
              </Button>
            </div>
          ) : (
            <Button variant="link">
              <Link href="/login">login/signin</Link>
            </Button>
          )}
        </CardHeader>
      </Card>
    </div>
  );
}
