import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { useAddComment } from "@/api/mutations/comments";

export default function AddComment({
  historyId,
  className,
}: {
  historyId: number;
  className?: string;
}) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [rating, setRating] = useState<number>(10);
  const mutation = useAddComment({ historyId });

  return (
    <div className={className}>
      <Label htmlFor="title">title</Label>
      <Input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="title"
      />
      <Label htmlFor="content">content</Label>
      <Input
        type="text"
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="content"
      />
      <Label htmlFor="rating">rating</Label>
      <Input
        id="rating"
        type="range"
        min={0}
        max={10}
        value={rating}
        onChange={(e) => setRating(e.target.valueAsNumber)}
      />
      <Button
        onClick={() => {
          mutation.mutate({ content, title, rating });
          setContent("");
          setTitle("");
          setRating(10);
        }}
      >
        submit
      </Button>
    </div>
  );
}
