import { useReducer, useState } from "react";
import JourneysList from "./journeysList";

import type getJourneys from "@/api/queries/getJourneys";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";

type Filters = Omit<Parameters<typeof getJourneys>[0], ""> & {
  countryId?: number;
};
type FiltersActions =
  | { type: "region"; value?: number }
  | { type: "country"; value?: number }
  | { type: "name"; value?: string }
  | { type: "start"; value?: Date | null }
  | { type: "end"; value?: Date | null }
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
    case "start":
      return {
        ...state,
        start: action.value?.getTime(),
      };
    case "end":
      return {
        ...state,
        end: action.value?.getTime(),
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
        <CardContent className="flex flex-col">
          <ul>
            <li>
              <Label className="w-full" htmlFor="name">
                name
              </Label>
              <div className="flex gap-x-2">
                <Input
                  onChange={(e) =>
                    dispatch({ type: "name", value: e.target.value })
                  }
                  type="text"
                  id="name"
                  placeholder="name"
                  value={f.name ?? ""}
                />
                <Button
                  onClick={() =>
                    dispatch({
                      type: "start",
                      value: undefined,
                    })
                  }
                >
                  reset
                </Button>
              </div>
            </li>
            <li>
              <Label className="w-full" htmlFor="start">
                start date
              </Label>

              <div className="flex gap-x-2">
                <Input
                  onChange={(e) =>
                    dispatch({
                      type: "start",
                      value: e.target.valueAsDate,
                    })
                  }
                  id="start"
                  type="date"
                  placeholder="start"
                />
                <Button
                  onClick={() =>
                    dispatch({
                      type: "start",
                      value: undefined,
                    })
                  }
                >
                  reset
                </Button>
              </div>
            </li>
            <li>
              <Label className="w-full" htmlFor="end">
                end date
              </Label>
              <div className="flex gap-x-2">
                <Input
                  onChange={(e) =>
                    dispatch({
                      type: "end",
                      value: e.target.valueAsDate,
                    })
                  }
                  id="end"
                  type="date"
                  placeholder="end"
                />
                <Button
                  onClick={() =>
                    dispatch({
                      type: "start",
                      value: undefined,
                    })
                  }
                >
                  reset
                </Button>
              </div>
            </li>
          </ul>
          <div className="flex gap-x-2 pt-2">
            <Button onClick={() => dispatch({ type: "reset" })}>
              reset all
            </Button>
            <Button onClick={() => setFOut(f)}>filter</Button>
          </div>
        </CardContent>
      </Card>
      <JourneysList
        className="flex flex-col items-center gap-6"
        query={{ ...fOut, ...filters }}
      ></JourneysList>
    </>
  );
}
