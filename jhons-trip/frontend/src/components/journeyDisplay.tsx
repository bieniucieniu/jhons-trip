import { Journey } from "@/api/queries/getJourneys";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";

export default function JourneyDisplay({
  name,
  description,
  start,
  end,
  slots,
  booked,
  details,
}: Journey) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{details}</p>
        <ul>
          <li>start: {format(start, "MM/dd/yyyy")}</li>
          <li>end: {format(end, "MM/dd/yyyy")}</li>
          <li>remaining slots: {slots - booked}</li>
          <li>booked: {booked}</li>
        </ul>
      </CardContent>
    </Card>
  );
}
