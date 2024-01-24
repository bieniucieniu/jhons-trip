import getBaseUrl from "@/lib/getBaseUrl";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export default function useGetLimit(table: string) {
  return useQuery({
    queryKey: ["limit" + table],
    queryFn: async () => {
      const res = await (
        await fetch(getBaseUrl() + "api/limit" + "?table=" + table, {
          mode: "cors",
          method: "GET",
        })
      ).json();
      if (res["error"]) throw new Error(res["error"]);
      return z.number().int().parse(res.value) as number | undefined;
    },
    staleTime: 1000 * 60 * 60 * 60,
  });
}
