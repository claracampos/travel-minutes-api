const request = require("supertest");
const app = require("../src/app");
const { setUpDatabase, testUserAuth, testEntry } = require("./fixture/db.js");

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

test("Get a single entry", async () => {
  await request(app)
    .get(`/entries/${testEntry._id}`)
    .set(testUserAuth)
    .expect(200, testEntry);
});

test("Edit an entry", async () => {
  await request(app)
    .patch(`/entries/${testEntry._id}`)
    .set(testUserAuth)
    .send({ done: testEntry.done, met: testEntry.met, seen: "updated" })
    .expect(200, {
      _id: testEntry._id,
      date: testEntry.date,
      place: testEntry.place,
      seen: "updated",
      done: testEntry.done,
      met: testEntry.met
    });
});

test("Delete an entry", async () => {
  await request(app)
    .delete(`/entries/${testEntry._id}`)
    .set(testUserAuth)
    .expect(200);
});
