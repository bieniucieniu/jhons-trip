import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";
import { z } from "zod";

const countriesSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  code: z.string(),
});

export default function getCoutries({
  limit,
  name,
  id,
}: {
  limit?: number;
  name?: string;
  id?: number;
}) {
  return useQuery({
    queryKey: ["countries", String(limit), name],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit: String(limit),
          name,
          id,
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
    staleTime: 10000,
  });
}
