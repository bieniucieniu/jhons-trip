import getJourneys from "@/api/queries/journeys";
import Book from "@/components/book";
import JourneyDisplay from "@/components/journeyDisplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "wouter";

export default function Journey() {
  const { id } = useParams();
  if (!id) return null;
  const { data, status, error, isError, isLoading } = getJourneys({
    id: Number(id),
    withComments: true,
  });
  if (isError)
    return (
      <div>
        {status}, error: {error.message}
      </div>
    );
  if (isLoading) return <div>{status}</div>;

  if (!data || data[0] === undefined) return <div>no data</div>;
  const comment = data[0].comment;

  return (
    <main className="m-auto flex flex-col gap-y-3 max-w-screen-lg py-10">
      <JourneyDisplay {...data[0]} />
      <Book id={data[0].id} name={data[0].name} />
      {comment?.length ? (
        <Card>
          <CardHeader>Comments</CardHeader>
          <CardContent>
            <ul>
              {comment.map(({ title, rating, content, user }) => (
                <li>
                  <Card>
                    <CardHeader>
                      <CardTitle>{title} </CardTitle>
                      <CardDescription>{user?.username}</CardDescription>
                      <CardContent>{content}</CardContent>
                      <CardFooter>rating {rating}/10</CardFooter>
                    </CardHeader>
                  </Card>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <p>no comments</p>
      )}
    </main>
  );
}
