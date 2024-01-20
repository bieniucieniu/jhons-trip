import { country, journey, region } from "@/shared/schema/journey";
import { db } from "./db";
import { faker } from "@faker-js/faker";

const countriesCount = 5;
const regionsCount = 4;
const journeysCount = 3;

async function insertTestData() {
  const c = Array.from({ length: countriesCount }).map(() => ({
    name: faker.location.country(),
    code: faker.location.countryCode(),
  }));
  const countrys = await db.insert(country).values(c).returning();

  const r: {
    name: string;
    countryId: number;
  }[] = [];

  countrys.forEach((v) => {
    for (let i = 0; i < regionsCount; i++) {
      r.push({
        name: faker.location.county(),
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
    imageUrl: string;
  }[] = [];
  regions.forEach((v) => {
    for (let i = 0; i < journeysCount; i++) {
      j.push({
        name: faker.location.city(),
        regionId: v.id,
        end: end.getTime(),
        start: start.getTime(),
        slots: 30,
        description: faker.lorem.slug(10),
        details: faker.lorem.slug(30),
        imageUrl: faker.image.urlLoremFlickr({ category: "journey" }),
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
