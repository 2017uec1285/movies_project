const request = require("supertest");
const { Rental } = require("../../model/rental");
const { User } = require("../../model/user");
const mongoose = require("mongoose");
const moment = require("moment");

let server;
let customerId;
let movieId;
let rental;
let token;

describe("/api/returns", async () => {
  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };
  beforeEach(async () => {
    server = require("../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    //await Rental.remove({});
    await server.close();
  });
  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });
  it("should return 400 if not have customer id", async () => {
    customerId = null;
    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 400 if not have movie id", async () => {
    movieId = null;
    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 404 if no data found related to customerId and movieId", async () => {
    await Rental.remove({});
    const res = await exec();

    expect(res.status).toBe(404);
  });
  it("should return 400 if data is already set", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 200 ", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
  it("should set return data if input is valid ", async () => {
    await exec();
    const res = await Rental.findById(rental._id);
    const diff = new Date() - res.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  });
  it("should set the rentalFee ", async () => {
    rental.dateOut = moment().add(-7, "days");
    await rental.save();
    await exec();
    const res = await Rental.findById(rental._id);
    expect(res.rentalFee).toBe(14);
  });
});
