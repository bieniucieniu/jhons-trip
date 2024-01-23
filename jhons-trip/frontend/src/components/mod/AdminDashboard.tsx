import useGetCoutries from "@/api/queries/countries";
import useGetJourneys from "@/api/queries/journeys";
import useGetRegions from "@/api/queries/regions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CardDescription } from "../ui/card";

export default function AdminDashboard() {
  const countreys = useGetCoutries({});
  const regions = useGetRegions({});
  const journeys = useGetJourneys({});

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>countreys</CardTitle>
          <CardDescription>{countreys.status}</CardDescription>
          {countreys.error ? countreys.error.message : null}
        </CardHeader>
        <CardContent>
          {countreys.data ? (
            <ul>
              {countreys.data.map(({ id, name, code }) => (
                <li>
                  name:{name} {code}
                  <br />
                  id:{id}
                  <br />
                </li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
