import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";

export default function getUserHistory({
  limit,
  name,
  journeyId,
}: {
  limit?: number;
  name?: string;
  journeyId?: number;
}) {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit: String(limit),
          name,
          journeyId: String(journeyId),
        }),
      ).toString();

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
      return res["data"] as {
        id: number;
        for: number;
        journeyName: string;
        userId: number;
        journeyId: number;
      }[];
    },
    staleTime: 0,
  });
}
