import getUserHistory from "@/api/queries/getUserHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function History() {
  const { data, isLoading, isError, error } = getUserHistory({});
  if (isLoading) return <div>is loading</div>;
  if (isError) return <div>{error.message}</div>;
  if (data)
    return (
      <main>
        <h1 className="text-7xl p-3">Journey History</h1>
        <ul className="flex flex-col gap-y-4 max-w-screen-lg mx-auto py-10">
          {data.map((d, i) => (
            <li key={d.journeyName + i}>
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
                      </CardHeader>
                      <CardContent>
                        <ul>
                          <li>{d.journey.name}</li>
                          <li>start: {d.journey.start}</li>
                          <li>end: {d.journey.end}</li>
                          <li>description: {d.journey.description}</li>
                        </ul>
                      </CardContent>
                    </Card>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </main>
    );
  return <div> unknown error</div>;
}
