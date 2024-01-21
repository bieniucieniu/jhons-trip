import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function Banner({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-3xl">Jhon's trip</CardTitle>
        <CardDescription className="text-xl">dream journeys</CardDescription>
      </CardHeader>
    </Card>
  );
}
