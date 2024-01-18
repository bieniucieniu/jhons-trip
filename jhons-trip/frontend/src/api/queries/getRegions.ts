import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";

export default function getRegions({
  limit,
  name,
  countryId,
  regionId,
}: {
  limit?: number;
  name?: string;
  countryId?: number;
  regionId?: number;
}) {
  return useQuery({
    queryKey: [
      "regions",
      String(limit),
      name,
      String(countryId),
      String(regionId),
    ],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit,
          name,
          countryId,
          regionId,
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
      return res["data"] as { id: number; name: string; countryId: number }[];
    },
    staleTime: 10000,
  });
}
