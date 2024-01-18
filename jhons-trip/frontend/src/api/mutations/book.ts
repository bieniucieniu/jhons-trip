import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";

export default function book(
  data: {
    for: number;
    journeyName: string;
    userId: number;
    journeyId: number;
  }[],
) {
  return useMutation({
    mutationKey: ["journeys", "history"],
    mutationFn: async () => {
      const res = await (
        await fetch(getBaseUrl() + "api/book", {
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
