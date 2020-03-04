const request = require("supertest");
const app = require("../src/app");
const {
  setUpDatabase,
  testUserAuth,
  testEntry,
  testEntryId
} = require("./fixture/db.js");

beforeAll(async () => {
  await setUpDatabase();
});

const newEntry = {
  date: "02/02/2020",
  place: "new place",
  seen: "new sight",
  done: "new action",
  met: "new friend"
};

test("Get all entries", async () => {
  await request(app)
    .get("/entries")
    .set(testUserAuth)
    .expect(200, [testEntry]);
});

test("Add an entry", async () => {
  await request(app)
    .post("/entries")
    .set(testUserAuth)
    .send(newEntry)
    .expect(201);
});
