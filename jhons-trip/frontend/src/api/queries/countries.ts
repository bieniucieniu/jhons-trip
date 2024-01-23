import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";
import { z } from "zod";

const countriesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  code: z.string(),
});

export default function useGetCoutries({
  limit,
  name,
  id,
  offset,
}: {
  limit?: number;
  name?: string;
  id?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["countries", "limit" + limit, name],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit,
          name,
          id,
          offset,
        }),
      ).toString();

      const res = await (
        await fetch(
          getBaseUrl() + "api/countries" + (params ? "?" + params : ""),
          {
            mode: "cors",
            method: "GET",
          },
        )
      ).json();
      if (res["error"]) throw new Error(res["error"]);
      return countriesSchema.array().parse(res["data"]);
    },
    staleTime: 1000 * 60 * 60,
  });
}
