import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";

export default function cancelJourney() {
  return useMutation({
    mutationKey: ["regions"],
    mutationFn: async (id: number) => {
      const res = await (
        await fetch(getBaseUrl() + "api/cancel", {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          method: "POST",
          body: JSON.stringify({ id }),
        })
      ).json();
      if (res["error"]) throw new Error(res["error"]);

      return res["data"];
    },
  });
}
