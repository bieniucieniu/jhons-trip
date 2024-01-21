import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import book, { bookSchema } from "@/api/mutations/book";
import { useEffect, useReducer, useState } from "react";
import { getUser } from "@/api/userAuth";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "wouter";
type Inputs = z.infer<typeof bookSchema>;
type Actions =
  | { type: "for"; value?: number }
  | { type: "journeyName"; value?: string }
  | { type: "userID"; value?: number };

function UserInputReducer(
  state: Partial<Inputs>,
  action: Actions,
): Partial<Inputs> {
  switch (action.type) {
    case "for":
      return {
        ...state,
        for: action.value,
      };
    case "journeyName":
      return {
        ...state,
        journeyName: action.value,
      };
    case "userID":
      return {
        ...state,
        userId: action.value,
      };
  }
}

export default function Book({
  className,
  id,
  name,
}: {
  className?: string;
  id: number;
  name: string;
}) {
  const [user, setUser] =
    useState<Partial<Awaited<ReturnType<typeof getUser>>>>(undefined);
  const [f, dispatch] = useReducer(UserInputReducer, {
    for: 1,
    journeyName: name,
    userId: undefined,
    journeyId: id,
  });
  useEffect(() => {
    getUser((u) => {
      setUser(u);
      dispatch({ type: "userID", value: u.user?.userID });
    });
  }, []);
  const bookMutation = book();

  if (!user) return <div>no user</div>;
  if (!user.user)
    return (
      <div>
        {user.error ? (
          <Button variant="link">
            <Link href="/login">login / signin</Link>
            {user.error}
          </Button>
        ) : null}
      </div>
    );
  if (!id) return <div>error no id provided</div>;

  if (bookMutation.isSuccess)
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>successfully booked</CardTitle>
        </CardHeader>
      </Card>
    );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>book</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          <li>
            <Label className="w-full" htmlFor="name">
              name
            </Label>
            <div className="flex gap-x-2">
              <Input
                disabled={bookMutation.isPending}
                onChange={(e) =>
                  dispatch({ type: "journeyName", value: e.target.value })
                }
                type="text"
                id="journeyName"
                placeholder="name of journey"
                value={f.journeyName ?? undefined}
              />
            </div>
          </li>
          <li>
            <Label className="w-full" htmlFor="name">
              for how many people?
            </Label>
            <div className="flex gap-x-2">
              <Input
                disabled={bookMutation.isPending}
                onChange={(e) =>
                  dispatch({ type: "for", value: e.target.valueAsNumber })
                }
                type="number"
                id="forNum"
                placeholder="for how many people?"
                value={f.for ?? 0}
              />
            </div>
          </li>
          <Button
            disabled={bookMutation.isPending}
            onClick={() => bookMutation.mutate([f])}
          >
            book
          </Button>
        </ul>
      </CardContent>
    </Card>
  );
}
