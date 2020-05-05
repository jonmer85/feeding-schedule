const request = require("supertest");
const app = require("../../src/app");

const { MongoClient } = require("mongodb");

let connection;
let db;

const user = {
  email: "bruce@wayneenterprises.com",
  password: "P@ssword",
  password2: "P@ssword",
  name: "Bruce Wayne",
};

beforeAll(async () => {
  connection = await MongoClient.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  db = await connection.db();
});

afterAll(async () => {
  await connection.close();
});

registerUserAndLogin = async () => {
  let token;

  const regRes = await request(app).post("/api/users/register").send(user);

  const loginRes = await request(app).post("/api/users/login").send({
    email: "bruce@wayneenterprises.com",
    password: "P@ssword",
  });

  return loginRes.body.token;
};

describe("Feeding event creation, deletion, and listing events", () => {
  let eventToDelete;
  
  it("should accept a feeding event creation request", async () => {
    const token = await registerUserAndLogin();
    const now = new Date();

    // Create an event
    return request(app)
    .post("/api/feeding/feeding_event")
    .set("Authorization", token)
    .send({
      amount: "3",
      fedOn: now.toISOString()
    })
    .expect(res => {
      eventToDelete = res.body._id
      console.log(eventToDelete)
      expect(res.status).toBe(201)
      expect(res.body.userEmail).toBe(user.email)
      expect(res.body.amount).toBe(3)
      expect(res.body.fedOn).toBe(now.toISOString())
    })
  })

  it("should return the 1 event for the user", async () => {
    const token = await registerUserAndLogin();

    return request(app)
    .get("/api/feeding/feeding_events")
    .set("Authorization", token)
    .expect(resp => {
      console.log(resp.body)
      expect(resp.status).toBe(200)
      expect(resp.body.length).toBe(1)
    })
  })

  it("should return the 2 events when another is created", async () => {
    const token = await registerUserAndLogin();
    
    await request(app)
    .post("/api/feeding/feeding_event")
    .set("Authorization", token)
    .send({
      amount: "4",
      fedOn: new Date().toISOString()
    })
    
    return request(app)
    .get("/api/feeding/feeding_events")
    .set("Authorization", token)
    .expect(resp => {
      expect(resp.status).toBe(200)
      expect(resp.body.length).toBe(2)
    })
  })

it("should allow deletion of the first event", async () => {
    const token = await registerUserAndLogin();
    
    await request(app)
    .delete(`/api/feeding/feeding_event/${eventToDelete}`)
    .set("Authorization", token)
    .expect(resp => {
        console.log(resp.body)
        expect(resp.status).toBe(200)
        expect(resp.body._id).toBe(eventToDelete)
    })
    
    return request(app)
    .get("/api/feeding/feeding_events")
    .set("Authorization", token)
    .expect(resp => {
      expect(resp.status).toBe(200)
      expect(resp.body.length).toBe(1)
    })
  })

  it("should fail an attempt to delete the deleted event", async () => {
    const token = await registerUserAndLogin();
    
    await request(app)
    .delete(`/api/feeding/feeding_event/${eventToDelete}`)
    .set("Authorization", token)
    .expect(400)
    
    return request(app)
    .get("/api/feeding/feeding_events")
    .set("Authorization", token)
    .expect(resp => {
      expect(resp.status).toBe(200)
      expect(resp.body.length).toBe(1)
    })
  })
})

describe("Erroneous situations", () => {
  it("should return 401 if not logged in", () => {
    return request(app).get("/api/feeding/feeding_event").expect(401);
  });

  it("should return 404 to GET's", async () => {
    const token = await registerUserAndLogin();

    return request(app)
      .get("/api/feeding/feeding_event")
      .set("Authorization", token)
      .expect(404);
  });

  it("should return an error on invalid amount", async () => {
    const token = await registerUserAndLogin();

    return request(app)
      .post("/api/feeding/feeding_event")
      .set("Authorization", token)
      .send({
        amount: "invalid",
        fedOn: new Date(),
      })
      .expect(400, {
        amount: "Amount is invalid",
      });
  });

  // Invalid Date
  it("should return an error on invalid date", async () => {
    const token = await registerUserAndLogin();

    return request(app)
      .post("/api/feeding/feeding_event")
      .set("Authorization", token)
      .send({
        amount: "4",
        fedOn: "Not a date",
      })
      .expect(400, {
        fedOn: "FedOn field is invalid",
      });
  });

  // Dupe event
  it("should return an error if a duplicate event tries to be created", async () => {
    const token = await registerUserAndLogin();

    const now = new Date();

    // Create an event
    const resp = await request(app)
    .post("/api/feeding/feeding_event")
    .set("Authorization", token)
    .send({
      amount: "3",
      fedOn: now.toISOString()
    })

    expect(resp.status).toBe(201);

    return request(app)
      .post("/api/feeding/feeding_event")
      .set("Authorization", token)
      .send({
        amount: "3",
        fedOn: now.toISOString()
      })
      .expect(400, {
        duplicate: 'Event already exists'
      });
  });

  // Delete an event that doesn't exist


});
