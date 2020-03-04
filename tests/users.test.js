const request = require("supertest");
const app = require("../src/app");
const User = require("../src/database/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const testUserId = new mongoose.Types.ObjectId();

const testUser = {
  _id: testUserId,
  email: "test@gmail.com",
  password: "testing123",
  tokens: [jwt.sign(testUserId.toString(), process.env.SECRET)]
};

const testUserAuth = { Authorization: testUser.tokens[0] };

const newUser = {
  email: "newuser@gmail.com",
  password: "testing123"
};

beforeAll(async () => {
  await User.deleteMany();
  await User.create({
    _id: testUser._id,
    email: testUser.email,
    password: await bcrypt.hash(testUser.password, 8),
    entries: [],
    tokens: testUser.tokens
  });
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
