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

const longEntry = {
  date: "02/02/2020",
  place: "new place",
  seen: "new sight",
  done: "new action",
  met:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
};

test("Get all entries", async () => {
  await request(app)
    .get("/entries")
    .set(testUserAuth)
    .expect(200, [testEntry]);
});

test("Fail to get all entries, not authorized", async () => {
  await request(app)
    .get("/entries")
    .set({ Authorization: "invalid token" })
    .expect(401);
});

test("Add an entry", async () => {
  await request(app)
    .post("/entries")
    .set(testUserAuth)
    .send(newEntry)
    .expect(201);
});

test("Fail to add an entry (entry is too long)", async () => {
  await request(app)
    .post("/entries")
    .set(testUserAuth)
    .send(longEntry)
    .expect(500);
});

test("Fail to add an entry (missing properties)", async () => {
  await request(app)
    .post("/entries")
    .set(testUserAuth)
    .send({ place: "test" })
    .expect(500);
});

test("Get a single entry", async () => {
  await request(app)
    .get(`/entries/${testEntry._id}`)
    .set(testUserAuth)
    .expect(200, testEntry);
});

test("Fail to get a single entry (wrong id)", async () => {
  await request(app)
    .get(`/entries/123test`)
    .set(testUserAuth)
    .expect(500);
});

test("Fail to get a single entry (not authorized)", async () => {
  await request(app)
    .get(`/entries/${testEntry._id}`)
    .set({ Authorization: "invalid token" })
    .expect(401);
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

test("Fail to edit an entry (too long)", async () => {
  await request(app)
    .patch(`/entries/${testEntry._id}`)
    .set(testUserAuth)
    .send({ done: testEntry.done, met: longEntry.met, seen: testEntry.seen })
    .expect(500);
});

test("Fail to edit an entry (not authorized)", async () => {
  await request(app)
    .patch(`/entries/${testEntry._id}`)
    .set({ Authorization: "invalid token" })
    .send({ done: testEntry.done, met: testEntry.met, seen: "updated" })
    .expect(401);
});

test("Fail to edit an entry (missing properties)", async () => {
  await request(app)
    .patch(`/entries/${testEntry._id}`)
    .set(testUserAuth)
    .send({ done: testEntry.done })
    .expect(500);
});

test("Delete an entry", async () => {
  await request(app)
    .delete(`/entries/${testEntry._id}`)
    .set(testUserAuth)
    .expect(200);
});

test("Fail to delete an entry (not authorized)", async () => {
  await request(app)
    .delete(`/entries/${testEntry._id}`)
    .set({ Authorization: "invalid token" })
    .expect(401);
});

test("Fail to delete an entry (invalid id)", async () => {
  await request(app)
    .delete(`/entries/test123`)
    .set(testUserAuth)
    .expect(500);
});
