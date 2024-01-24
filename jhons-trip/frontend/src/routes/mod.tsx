import { useCancelJourney } from "@/api/mutations/book";
import { useDeleteComment } from "@/api/mutations/comments";
import useGetComments from "@/api/queries/comments";
import useGetUser from "@/api/queries/user";
import useGetUserHistory from "@/api/queries/userHistory";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";

export default function Mod() {
  const user = useGetUser();
  if (user.data && user.data.privilege < 10) return <div></div>;

  return (
    <main className="grid grid-cols-2">
      <ModDashboard />
    </main>
  );
}

export function ModDashboard() {
  const history = useGetUserHistory({});
  const comment = useGetComments({});
  const cancel = useCancelJourney();
  const deleteComment = useDeleteComment();
  useEffect(() => {
    if (deleteComment.isSuccess) location.reload();
  }, [deleteComment.isSuccess]);
  useEffect(() => {
    if (cancel.isSuccess) location.reload();
  }, [cancel.isSuccess]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>recent booking</CardTitle>
          <CardDescription>
            {history.status}{" "}
            {history.error ? "| " + history.error.message : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            {history.data && history.data.length
              ? history?.data.map((h) => (
                  <li>
                    <Card>
                      <CardHeader>
                        <CardTitle>{h.journeyName}</CardTitle>
                        <CardDescription>{h.journeyId}</CardDescription>
                      </CardHeader>
                      <CardContent></CardContent>
                      <CardFooter>
                        <Button onClick={() => cancel.mutate(h.id)}>
                          Cancel
                        </Button>
                      </CardFooter>
                    </Card>
                  </li>
                ))
              : "no recent booking"}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>recent comments</CardTitle>
          <CardDescription>
            {comment.status}{" "}
            {comment.error ? "| " + comment.error.message : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul>
            {comment.data && comment.data.length
              ? comment?.data.map((c) => (
                  <li>
                    <Card>
                      <CardHeader>
                        <CardTitle>{c.title}</CardTitle>
                        {c.user ? (
                          <CardDescription>
                            {c.user.username} | {c.user.id}
                          </CardDescription>
                        ) : null}
                      </CardHeader>
                      <CardContent>{c.content}</CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => {
                            deleteComment.mutate(c.id);
                          }}
                        >
                          delete
                        </Button>
                      </CardFooter>
                    </Card>
                  </li>
                ))
              : "no recent comments"}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
