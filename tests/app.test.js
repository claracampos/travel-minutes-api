const request = require("supertest");
const app = require("../src/app");
const User = require("../src/database/user");

const testUser = {
  email: "test@gmail.com",
  password: "testing123",
  entry: {
    date: "01/01/2020",
    place: "test place",
    seen: "test sights",
    done: "test actions",
    met: "test friends"
  }
};

beforeAll(async () => {
  await User.deleteMany();
});

test("Register a new user", async () => {
  await request(app)
    .post("/register")
    .send({ email: testUser.email, password: testUser.password })
    .expect(201);
});

test("Fail to register an existing user", async () => {
  await request(app)
    .post("/register")
    .send({ email: testUser.email, password: testUser.password })
    .expect(500);
});

test("Fail to register with an invalid email", async () => {
  await request(app)
    .post("/register")
    .send({ email: "test", password: testUser.password })
    .expect(500);
});

test("Fail to register with an invalid password (too short)", async () => {
  await request(app)
    .post("/register")
    .send({ email: testUser.email, password: "123" })
    .expect(500);
});

test("Fail to register with an invalid password (too long)", async () => {
  await request(app)
    .post("/register")
    .send({ email: testUser.email, password: "verylongpassword" })
    .expect(500);
});
