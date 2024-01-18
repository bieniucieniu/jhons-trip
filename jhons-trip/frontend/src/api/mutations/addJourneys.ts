import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";

export default function addJourneys(
  data: {
    name: string;
    description: string;
    details: string;
    start: number;
    end: number;
    slots: number;
    regionId: number;
    countryId: number;
  }[],
) {
  return useMutation({
    mutationKey: ["journeys"],
    mutationFn: async () => {
      const res = await (
        await fetch(getBaseUrl() + "api/journeys", {
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
