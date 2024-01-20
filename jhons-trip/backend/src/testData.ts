import { country, journey, region } from "@/shared/schema/journey";
import { db } from "./db";

const countriesCount = 5;
const regionsCount = 4;
const journeysCount = 3;

async function insertTestData() {
  const c = Array.from({ length: countriesCount }).map((_, i) => ({
    name: "countries" + (i + 1),
    code: "CT" + (i + 1),
  }));
  const countrys = await db.insert(country).values(c).returning();

  const r: {
    name: string;
    countryId: number;
  }[] = [];

  countrys.forEach((v) => {
    for (let i = 0; i < regionsCount; i++) {
      r.push({
        name: "Region" + (i + 1),
        countryId: v.id,
      });
    }
  });

  const regions = await db.insert(region).values(r).returning();

  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 7);

  const j: {
    name: string;
    regionId: number;
    start: number;
    end: number;
    slots: number;
    details: string;
    description: string;
  }[] = [];
  regions.forEach((v) => {
    for (let i = 0; i < journeysCount; i++) {
      j.push({
        name: "journey" + (i + 1),
        regionId: v.id,
        end: end.getTime(),
        start: start.getTime(),
        slots: 30,
        description: "journeys " + v.name + (i + 1),
        details: "journeys " + v.name + (i + 1),
      });
    }
  });

  await db.insert(journey).values(j);
}
try {
  insertTestData();
} catch (e) {
  console.error(e);
}
