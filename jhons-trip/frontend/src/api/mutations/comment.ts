import { useMutation } from "@tanstack/react-query";

export function useAddComment() {
  return useMutation({
    mutationKey: ["comment"],
    mutationFn: async () => {},
  });
}
