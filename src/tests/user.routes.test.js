const request = require("supertest");
const app = require("../../src/app");

const { MongoClient } = require("mongodb");

let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

describe("Registration with GET", () => {
  it("should return errors", () => {
    return request(app).get("/api/users/register").expect(404);
  });
});

describe("Registration with no email or password2 set", () => {
  it("Should return an error", () => {
    return request(app)
      .post("/api/users/register")
      .send({
        password: "test password",
      })
      .expect(400, {
        name: "Name field is required",
        password2: "Passwords must match",
      });
  });
});

describe("Successful Registration", () => {
  it("Should successfully save the user", () => {
    return request(app)
      .post("/api/users/register")
      .send({
        email: "bruce@wayneenterprises.com",
        password: "P@ssword",
        password2: "P@ssword",
        name: "Bruce Wayne",
      })
      .expect(res => {
        expect(res.status).toBe(201)
        expect(res.body.name).toBe("Bruce Wayne")
        expect(res.body.email).toBe("bruce@wayneenterprises.com")
      })
    });

  it("allows the new user to login", () => {
    return request(app)
    .post('/api/users/login')
    .send({
      email: "bruce@wayneenterprises.com",
      password: "P@ssword",
    })
    .expect(res => {
      expect(res.status).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.token).toContain("Bearer ")
    })
  });

  it("rejects a bad password", () => {
    return request(app)
    .post('/api/users/login')
    .send({
      email: "bruce@wayneenterprises.com",
      password: "NotMyP@ssword",
    })
    .expect(400, {
      passwordincorrect: "Password incorrect"
    })
  });



});
