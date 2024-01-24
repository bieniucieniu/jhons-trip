import { Journey } from "@/api/queries/journeys";
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
  price,
}: Omit<Journey, "details"> & { details?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-between gap-y-3">
        <div className="flex flex-col gap-y-10">
          {details ? <p>{details}</p> : null}
          <ul className="flex flex-col pl-6">
            <li>start: {format(start, "MM/dd/yyyy")}</li>
            <li>end: {format(end, "MM/dd/yyyy")}</li>
            <li>remaining slots: {slots - booked}</li>
            <li>booked: {booked}</li>
            <li>price: {price}$</li>
          </ul>
          {region ? (
            <p>
              {region?.name} | {region.country?.name}
            </p>
          ) : null}
        </div>
        {imageUrl ? (
          <img
            className="h-auto w-[400px] rounded-lg"
            src={imageUrl}
            alt={"img-" + name}
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
