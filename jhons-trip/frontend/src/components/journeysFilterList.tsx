import { useReducer, useState } from "react";
import JourneysList from "./journeysList";

import type getJourneys from "@/api/queries/getJourneys";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Filters = Omit<Parameters<typeof getJourneys>[0], ""> & {
  countryId?: number;
};
type FiltersActions =
  | { type: "region"; value: number }
  | { type: "country"; value: number }
  | { type: "name"; value: string }
  | { type: "reset" };
function FiltersReducer(state: Filters, action: FiltersActions): Filters {
  switch (action.type) {
    case "name":
      return {
        ...state,
        name: action.value,
      };
    case "region":
      return {
        ...state,
        regionId: action.value,
      };
    case "country":
      return {
        ...state,
        countryId: action.value,
      };
    case "reset":
      return {};
  }
}

export default function JourneysFilterList({
  filters,
}: {
  filters?: {
    limit?: number;
    offset?: number;
  };
}) {
  const [f, dispatch] = useReducer(FiltersReducer, {});
  const [fOut, setFOut] = useState<Filters>({});

  return (
    <>
      <Card className="mb-10">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            onChange={(e) => dispatch({ type: "name", value: e.target.value })}
            type="text"
            placeholder="name"
            value={f.name ?? ""}
          />
          <Button onClick={() => dispatch({ type: "reset" })}>reset</Button>
          <Button onClick={() => setFOut(f)}>filter</Button>
        </CardContent>
      </Card>
      <JourneysList
        className="flex flex-col items-center gap-6"
        query={{ ...fOut, ...filters }}
      ></JourneysList>
    </>
  );
}
