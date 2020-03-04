const request = require("supertest");
const app = require("../src/app");
const { setUpDatabase, testUserAuth, testUser } = require("./fixture/db.js");

const newUser = {
  email: "newuser@gmail.com",
  password: "testing123"
};

beforeAll(async () => {
  setUpDatabase();
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
    .send({ email: testUser.email, password: testUser.password })
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

test("Log in user", async () => {
  await request(app)
    .post("/login")
    .send({ email: newUser.email, password: newUser.password })
    .expect(200);
});

test("Failed login (wrong password)", async () => {
  await request(app)
    .post("/login")
    .send({ email: newUser.email, password: "password" })
    .expect(401);
});

test("Failed login (invalid user)", async () => {
  await request(app)
    .post("/login")
    .send({ email: "invalid@gmail.com", password: "password" })
    .expect(401);
});

test("Password change", async () => {
  await request(app)
    .patch("/password")
    .send({ oldPassword: testUser.password, newPassword: "test1234" })
    .set(testUserAuth)
    .expect(200);
});

test("Failed password change (wrong password)", async () => {
  await request(app)
    .patch("/password")
    .send({ oldPassword: "incorrect", newPassword: "test1234" })
    .set(testUserAuth)
    .expect(500);
});

test("Failed password change (new password is too short)", async () => {
  await request(app)
    .patch("/password")
    .send({ oldPassword: testUser.password, newPassword: "test" })
    .set(testUserAuth)
    .expect(500);
});

test("Failed password change (no auth)", async () => {
  await request(app)
    .patch("/password")
    .send({ oldPassword: testUser.password, newPassword: "test1234" })
    .expect(401);
});

test("Log out user", async () => {
  await request(app)
    .post("/logout")
    .set(testUserAuth)
    .expect(200);
});

test("Failed logout (no auth header)", async () => {
  await request(app)
    .post("/logout")
    .expect(401);
});
