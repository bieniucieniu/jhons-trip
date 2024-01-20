import getJourneys from "@/api/queries/getJourneys";
import { Link } from "wouter";
import JourneyDisplay from "./journeyDisplay";

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
      {data?.map((props) => (
        <li key={props.name + props.id}>
          <JourneyDisplay {...props}></JourneyDisplay>
          <Link href={`/journey/${props.id}`}>more</Link>
        </li>
      ))}
    </ul>
  );
}
