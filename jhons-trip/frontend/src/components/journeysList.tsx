import getJourneys from "@/api/queries/getJourneys";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "wouter";

export default function JourneysList() {
  const { data, status, error, isError, isLoading } = getJourneys({});
  if (isError)
    return (
      <div>
        {status}, error: {error.message}
      </div>
    );
  if (isLoading) return <div>{status}</div>;
  return (
    <ul>
      {data?.map(({ name, description, start, end, slots, booked, id }) => (
        <li>
          <Card>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul>
                <li>start: {start}</li>
                <li>end: {end}</li>
                <li>remaining slots: {slots - booked}</li>
                <li>booked: {booked}</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={`/Journeys/${id}`}>more</Link>
            </CardFooter>
          </Card>
        </li>
      ))}
    </ul>
  );
}
