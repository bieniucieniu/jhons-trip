import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "../../utlis/getBaseUrl";

export default function getJourneys({
  limit,
  name,
  countryId,
}: {
  limit: number;
  name: string;
  countryId: number;
}) {
  return useQuery({
    queryKey: ["journeys", String(limit), name, String(countryId)],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(limit),
        name,
        countryId: String(countryId),
      }).toString();

      const res = await (
        await fetch(getBaseUrl() + "api/regions" + params ? "&" + params : "", {
          mode: "cors",
          method: "GET",
        })
      ).json();
      if (res["error"]) throw new Error(res["error"]);
      return res["data"];
    },
    staleTime: 10000,
  });
}
