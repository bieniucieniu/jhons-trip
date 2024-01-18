import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "../../utlis/getBaseUrl";

export default function getUserHistory({
  limit,
  name,
  journeyId,
}: {
  limit: number;
  name: string;
  journeyId: number;
}) {
  return useQuery({
    queryKey: ["history", String(limit), name, String(journeyId)],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(limit),
        name,
        journeyId: String(journeyId),
      }).toString();

      const res = await (
        await fetch(
          getBaseUrl() + "api/countries" + params ? "&" + params : "",
          {
            mode: "cors",
            method: "GET",
          },
        )
      ).json();
      if (res["error"]) throw new Error(res["error"]);
      return res["data"];
    },
    staleTime: 10000,
  });
}
