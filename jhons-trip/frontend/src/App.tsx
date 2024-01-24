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
import Checkout from "./routes/checkout";
import Mod from "./routes/mod";
import Admin from "./routes/admin";

export default function App() {
  const user = useGetUser();
  return (
    <div className="pt-[200px]">
      <Switch>
        <Route path="/" component={Root} />
        <Route path="/journey/:id" component={Journey} />
        <Route path="/browse/:page" component={Browse} />
        <Route path="/browse">
          <Redirect to="/browse/1" />;
        </Route>
        <Route path="/checkout" component={Checkout} />
        <Route path="/login" component={Login} />
        <Route path="/history" component={History} />
        <Route path="/mod" component={Mod} />
        <Route path="/admin" component={Admin} />
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
            {user.data?.privilege ? (
              user.data.privilege >= 100 ? (
                <Link href="/admin">admin dashboard</Link>
              ) : user.data.privilege >= 10 ? (
                <Link href="/mod">mod dashboard</Link>
              ) : null
            ) : null}
          </nav>
          {user && user.data ? (
            <div className="flex gap-x-3">
              <div className="flex gap-y-3 justify-start">
                <Button variant="link">
                  <Link href="/checkout">checkout</Link>
                </Button>
                <Button variant="link">
                  <Link href="/history">history of booking</Link>
                </Button>
              </div>
              <div className="flex flex-col gap-y-3">
                <CardTitle className="mx-auto my-2.5">
                  loged as {user?.data.username}
                </CardTitle>
                <Button
                  onClick={() => {
                    logout();
                    user.refetch();
                  }}
                >
                  logout
                </Button>
              </div>
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
