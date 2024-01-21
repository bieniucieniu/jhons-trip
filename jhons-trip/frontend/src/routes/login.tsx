import { genUser, getUser, login } from "@/api/userAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useReducer, useState } from "react";

type Inputs = {
  username?: string;
  password?: string;
};

type Actions =
  | {
      type: "username";
      value: string;
    }
  | {
      type: "password";
      value: string;
    };
function UserInputReducer(
  state: Partial<Inputs>,
  action: Actions,
): Partial<Inputs> {
  switch (action.type) {
    case "username":
      return {
        ...state,
        username: action.value,
      };
    case "password":
      return {
        ...state,
        password: action.value,
      };
  }
}
export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [com, setCom] = useState<{
    message?: string;
    error?: string | Error;
  }>({
    message: "",
    error: undefined,
  });
  const [user, setUser] =
    useState<Partial<Awaited<ReturnType<typeof getUser>>>>(undefined);
  useEffect(() => {
    getUser((u) => setUser(u));
  }, []);

  if (user?.user)
    return (
      <div>
        <h1>hello {user.user.username}</h1>
      </div>
    );

  const [f, dispatch] = useReducer(UserInputReducer, {
    username: "",
    password: "",
  });
  return (
    <Card className="max-w-screen-sm mx-auto my-10">
      <CardContent>
        <Label>username</Label>
        <Input
          id="username"
          type="text"
          disabled={loading}
          value={f.username}
          onChange={(e) =>
            dispatch({ type: "username", value: e.target.value })
          }
        />
        <Label>password</Label>
        <Input
          id="password"
          type="password"
          disabled={loading}
          value={f.password}
          onChange={(e) =>
            dispatch({ type: "password", value: e.target.value })
          }
        />
        <div className="pt-2 flex gap-2">
          <Button
            disabled={loading}
            variant="secondary"
            onClick={() => {
              setLoading(true);
              if (!f.password || !f.username) {
                setCom({ error: "no username or password" });
                setLoading(false);
                return;
              }
              genUser(f.username, f.password, (e) => {
                if (e.error) {
                  setCom({ error: e.error });
                  setLoading(false);
                  return;
                }
                if (!e.token) {
                  setCom({ error: "no token has been returned" });
                  setLoading(false);
                  return;
                }
                document.cookie = "token=" + e.token + "; ";
                document.location.reload();
              });
            }}
          >
            signin
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              setLoading(true);
              if (!f.password || !f.username) {
                setCom({ error: "no username or password" });
                setLoading(false);
                return;
              }
              login(f.username, f.password, (e) => {
                if (e.error) {
                  setCom({ error: e.error });
                  setLoading(false);
                  return;
                }
                if (!e.token) {
                  setCom({ error: "no token has been returned" });
                  setLoading(false);
                  return;
                }
                document.cookie = "token=" + e.token + "; ";
                document.location.reload();
              });
            }}
          >
            login
          </Button>
        </div>
        {com?.error ? <span>{com?.error && com.error?.toString()}</span> : null}
        {com?.message ? <span>{com?.message}</span> : null}
      </CardContent>
    </Card>
  );
}
