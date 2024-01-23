import getJourneys from "@/api/queries/journeys";
import { Link } from "wouter";
import JourneyDisplay from "./journeyDisplay";
import { Card } from "./ui/card";

export default function JourneysList({
  className,
  query,
}: {
  className?: string;
  query?: Parameters<typeof getJourneys>[0];
}) {
  const { data, status, error, isError, isLoading } = getJourneys({
    ...query,
  });
  if (isError)
    return (
      <div>
        {status}, error: {error.message}
      </div>
    );
  if (isLoading) return <div>{status}</div>;
  if (!data || data.length === 0) <div>no more data</div>;
  return (
    <ul className={className}>
      {data?.map(({ details: _, ...props }) => (
        <li key={props.name + props.id}>
          <Card>
            <JourneyDisplay {...props}></JourneyDisplay>
            <Link
              href={`/journey/${props.id}`}
              className="group ml-3 leading-8 hover:leading-10 transition-all"
            >
              <span className="underline-offset-2 group-hover:underline">
                book / read more about {props.name}
              </span>
              <span className="group-hover:pl-1 transition-all">&gt;&gt;</span>
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}
