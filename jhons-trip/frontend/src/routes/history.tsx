import { useCancelJourney } from "@/api/mutations/book";
import getUserHistory from "@/api/queries/userHistory";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

function Tile({
  data: d,
  lock,
  setLock,
}: {
  data: NonNullable<ReturnType<typeof getUserHistory>["data"]>[number];
  lock: boolean;
  setLock: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (!d) return null;
  const cancel = useCancelJourney();
  const [cancelEnable, setCancelEnable] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);

  if (deleted)
    return (
      <Card>
        <CardHeader>
          <CardTitle>deleted</CardTitle>
          <CardDescription>will disappear after reloading page</CardDescription>
        </CardHeader>
      </Card>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{d.journeyName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          <li>for: {d.for}</li>
        </ul>
        {d.journey ? (
          <Card>
            <CardHeader>
              <CardTitle> journey details</CardTitle>
              <CardDescription>{d.id}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                <li>{d.journey.name}</li>
                <li>start: {d.journey.start}</li>
                <li>end: {d.journey.end}</li>
                <li>description: {d.journey.description}</li>
              </ul>
              <div className="flex gap-x-3">
                <Button
                  disabled={lock}
                  variant={cancelEnable ? "outline" : "default"}
                  onClick={() => setCancelEnable((t) => !t)}
                >
                  {cancelEnable ? "no" : "cancel"}
                </Button>
                <Button
                  variant="destructive"
                  disabled={!cancelEnable || lock}
                  onClick={() => {
                    setLock(true);
                    cancel.mutate(d.id, {
                      onSuccess: () => {
                        setLock(false);
                        setDeleted(true);
                      },
                    });
                  }}
                >
                  {cancelEnable ? "yes" : "?"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </CardContent>
    </Card>
  );
}
export default function History() {
  const { data, isLoading, isError, error } = getUserHistory({});
  const [lock, setLock] = useState<boolean>(false);
  if (isLoading) return <div>is loading</div>;
  if (isError) return <div>{error.message}</div>;
  if (data)
    return (
      <main>
        <h1 className="text-7xl p-3">Journey History</h1>
        <ul className="flex flex-col gap-y-4 max-w-screen-lg mx-auto py-10">
          {data.map((d, i) => (
            <li key={d.journeyName + i}>
              <Tile data={d} lock={lock} setLock={setLock} />
            </li>
          ))}
        </ul>
      </main>
    );
  return <div> unknown error</div>;
}
