import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";

export default function getJourneys({
  limit,
  name,
  id,
  countryId,
}: {
  limit?: number;
  name?: string;
  countryId?: number;
  id?: number;
}) {
  return useQuery({
    queryKey: ["journeys", String(limit), name, String(countryId)],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit,
          name,
          countryId,
          id,
        }),
      ).toString();

      const res = await (
        await fetch(
          getBaseUrl() + "api/regions" + (params ? "&" + params : ""),
          {
            mode: "cors",
            method: "GET",
          },
        )
      ).json();
      if (res["error"]) throw new Error(res["error"]);
      return res["data"] as {
        id: number;
        name: string;
        description: string;
        details: string;
        start: number;
        end: number;
        slots: number;
        booked: number;
        regionId: number;
        countryId: number;
      }[];
    },
    staleTime: 10000,
  });
}
