import getBaseUrl from "@/src/utlis/getBaseUrl";
import { useMutation } from "@tanstack/react-query";

export default function addRegions(
  data: {
    countryId: string;
    name: string;
  }[],
) {
  return useMutation({
    mutationKey: ["regions"],
    mutationFn: async () => {
      const res = await (
        await fetch(getBaseUrl() + "api/regions", {
          mode: "cors",
          method: "POST",
          body: JSON.stringify({ data }),
        })
      ).json();
      if (res["error"]) throw new Error(res["error"]);

      return res["data"];
    },
  });
}
