import { Comment } from "@/api/queries/comments";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useGetUser from "@/api/queries/user";
import { Button } from "./ui/button";

export default function commentList(comments: Comment[]) {
  const { data } = useGetUser();
  return (
    <ul>
      {comments.map(({ title, rating, content, user }) => (
        <li>
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{user?.username}</CardDescription>
              <CardContent>{content}</CardContent>
              <CardFooter>rating {rating}/10</CardFooter>
              {data && data.privilege >= 10 ? <Button></Button> : null}
            </CardHeader>
          </Card>
        </li>
      ))}
    </ul>
  );
}
