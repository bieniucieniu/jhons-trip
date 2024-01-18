import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";

export default function getCoutries({
  limit,
  name,
}: {
  limit?: number;
  name?: string;
}) {
  return useQuery({
    queryKey: ["countries", String(limit), name],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit: String(limit),
          name,
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
      return res["data"] as { id: number; name: string; code: string }[];
    },
    staleTime: 10000,
  });
}
