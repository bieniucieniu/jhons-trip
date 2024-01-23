import { useEffect, useReducer } from "react";
import JourneysList from "./journeysList";

import type getJourneys from "@/api/queries/journeys";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import cleanupObject from "@/lib/cleanupObject";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { getParamsObject } from "@/lib/utils";

type Filters = Omit<Parameters<typeof getJourneys>[0], ""> & {
  countryId?: number;
};
type FiltersActions =
  | { type: "regionId"; value?: number }
  | { type: "countryId"; value?: number }
  | { type: "name"; value?: string }
  | { type: "start"; value?: Date | null }
  | { type: "end"; value?: Date | null }
  | { type: "reset" };
function FiltersReducer(state: Filters, action: FiltersActions): Filters {
  if (action.type !== "reset" && action.value === null) {
    state[action.type] = undefined;
    return { ...state };
  }
  switch (action.type) {
    case "name":
      return {
        ...state,
        name: action.value,
      };
    case "regionId":
      return {
        ...state,
        regionId: action.value,
      };
    case "countryId":
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
  const [location, setLocation] = useLocation();
  console.log(location, window.location.search);
  const [f, dispatch] = useReducer(FiltersReducer, getParamsObject());
  useEffect(() => {
    const p = new URLSearchParams(cleanupObject(f)).toString();
    setLocation(location.split("?")[0] + "?" + p);
  }, [f]);

  return (
    <div className="grid grid-cols-2 items-start gap-6">
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
                  value={f?.name ?? ""}
                />
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
                  value={f?.start ? format(f.start, "yyyy-MM-dd") : undefined}
                  id="start"
                  type="date"
                  placeholder="start"
                />
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
                  value={f?.end ? format(f.end, "yyyy-MM-dd") : undefined}
                  type="date"
                  placeholder="end"
                />
              </div>
            </li>
          </ul>
          <div className="flex gap-x-2 pt-2">
            <Button
              variant="destructive"
              onClick={() => dispatch({ type: "reset" })}
            >
              reset all
            </Button>
          </div>
        </CardContent>
      </Card>
      <JourneysList
        className="flex flex-col items-center gap-6 min-w-[756px]"
        query={{ ...f, ...filters }}
      ></JourneysList>
    </div>
  );
}
