import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";
import { z } from "zod";

const regionsSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  countryId: z.number().int(),
});

export default function getRegions({
  limit,
  name,
  countryId,
  id,
  offset,
}: {
  limit?: number;
  name?: string;
  countryId?: number;
  id?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["regions", "limit" + limit, name, "country" + countryId],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit,
          name,
          countryId,
          id,
          offset,
        }),
      ).toString();

      const res = await (
        await fetch(
          getBaseUrl() + "api/regions" + (params ? "?" + params : ""),
          {
            mode: "cors",
            method: "GET",
          },
        )
      ).json();
      if (res["error"]) throw new Error(res["error"]);
      return regionsSchema.array().parse(res["data"]);
    },
    staleTime: 10000,
  });
}
