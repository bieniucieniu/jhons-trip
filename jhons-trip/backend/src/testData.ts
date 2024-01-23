import { country, journey, region } from "@/shared/schema/journey";
import { db } from "./db";
import { faker } from "@faker-js/faker";
import { user } from "@/shared/schema/user";

const countriesCount = 5;
const regionsCount = 4;
const journeysCount = 3;

async function insertTestData() {
  const c: (typeof country.$inferInsert)[] = Array.from({
    length: countriesCount,
  }).map(() => ({
    name: faker.location.country().toUpperCase(),
    code: faker.location.countryCode(),
  }));
  const countrys = await db.insert(country).values(c).returning();

  const r: (typeof region.$inferInsert)[] = [];

  countrys.forEach((v) => {
    for (let i = 0; i < regionsCount; i++) {
      r.push({
        name: faker.location.county().toUpperCase(),
        countryId: v.id,
      });
    }
  });

  const regions = await db.insert(region).values(r).returning();

  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 7);
  const j: (typeof journey.$inferInsert)[] = [];
  regions.forEach((v) => {
    for (let i = 0; i < journeysCount; i++) {
      j.push({
        name: faker.location.city().toUpperCase(),
        regionId: v.id,
        end: end.getTime(),
        start: start.getTime(),
        slots: faker.number.int({ min: 30, max: 100 }),
        description: faker.lorem.words(10),
        details: faker.lorem.words(30),
        imageUrl: faker.image.urlLoremFlickr({ category: "journey" }),
        price: faker.number.int({ min: 2000, max: 4000 }),
      });
    }
  });

  await db.insert(journey).values(j);

  await db.insert(user).values([
    {
      password: "admin",
      username: "admin",
      privilege: 100,
    },
    {
      password: "mod",
      username: "mod",
      privilege: 10,
    },
    {
      password: "sample",
      username: "sample",
    },
  ]);
}

try {
  insertTestData();
} catch (e) {
  console.error(e);
}
