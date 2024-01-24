import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useBook, bookSchema } from "@/api/mutations/book";
import { useReducer } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "wouter";
import useGetUser from "@/api/queries/user";
import { useBasket } from "./basket";
type Inputs = z.infer<typeof bookSchema>;
type Actions =
  | { type: "for"; value?: number }
  | { type: "journeyName"; value?: string };

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
  const [f, dispatch] = useReducer(UserInputReducer, {
    for: 1,
    journeyName: name,
    userId: undefined,
    journeyId: id,
  });
  const user = useGetUser();
  const { addBook } = useBasket();
  if (!user) return <div>no user</div>;
  if (!user.data)
    return (
      <div>
        {user.error ? <p>{user.error.message}</p> : null}
        <Button variant="link">
          <Link href="/login">login / signin</Link>
        </Button>
      </div>
    );
  if (!id) return <div>error no id provided</div>;

  if (!!true)
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
          <Button onClick={() => addBook(f)}>book</Button>
        </ul>
      </CardContent>
    </Card>
  );
}
