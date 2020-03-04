const request = require("supertest");
const app = require("../src/app");
const User = require("../src/database/user");

const newUser = {
  email: "newuser@gmail.com",
  password: "testing123"
};

beforeAll(async () => {
  await User.deleteMany();
});

test("Register a new user", async () => {
  await request(app)
    .post("/register")
    .send({ email: newUser.email, password: newUser.password })
    .expect(201);
});

test("Fail to register an existing user", async () => {
  await request(app)
    .post("/register")
    .send({ email: newUser.email, password: newUser.password })
    .expect(500);
});

test("Fail to register with an invalid email", async () => {
  await request(app)
    .post("/register")
    .send({ email: "test", password: newUser.password })
    .expect(500);
});

test("Fail to register with an invalid password (too short)", async () => {
  await request(app)
    .post("/register")
    .send({ email: newUser.email, password: "123" })
    .expect(500);
});

test("Fail to register with an invalid password (too long)", async () => {
  await request(app)
    .post("/register")
    .send({ email: newUser.email, password: "verylongpassword" })
    .expect(500);
});
