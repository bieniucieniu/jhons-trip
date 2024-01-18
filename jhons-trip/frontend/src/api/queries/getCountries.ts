import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "../../utlis/getBaseUrl";

export default function getCoutries({
  limit,
  name,
}: {
  limit: number;
  name: string;
}) {
  return useQuery({
    queryKey: ["countries", String(limit), name],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(limit),
        name,
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
