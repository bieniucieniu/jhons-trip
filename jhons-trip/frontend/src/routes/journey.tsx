import getJourneys from "@/api/queries/getJourneys";
import Book from "@/components/book";
import JourneyDisplay from "@/components/journeyDisplay";
import { useParams } from "wouter";

export default function Journey() {
  const { id } = useParams();
  if (!id) return null;
  const { data, status, error, isError, isLoading } = getJourneys({
    id: Number(id),
  });
  if (isError)
    return (
      <div>
        {status}, error: {error.message}
      </div>
    );
  if (isLoading) return <div>{status}</div>;

  if (!data || data[0] === undefined) return <div>no data</div>;

  return (
    <main className="m-auto max-w-screen-lg py-10">
      <JourneyDisplay {...data[0]} />
      <Book id={data[0].id} name={data[0].name} />
    </main>
  );
}
