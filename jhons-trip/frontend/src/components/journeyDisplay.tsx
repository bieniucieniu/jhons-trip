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
  imageUrl,
  region,
}: Omit<Journey, "details"> & { details?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-x-10">
        <div className="flex flex-col gap-y-10">
          {details ? <p>{details}</p> : null}
          <ul className="flex flex-col pl-6">
            <li>start: {format(start, "MM/dd/yyyy")}</li>
            <li>end: {format(end, "MM/dd/yyyy")}</li>
            <li>remaining slots: {slots - booked}</li>
            <li>booked: {booked}</li>
          </ul>
          {region ? <p>{region.name}</p> : null}
        </div>
        {imageUrl ? (
          <img
            className="h-[300px] w-auto rounded-lg"
            src={imageUrl}
            alt={"img-" + name}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
