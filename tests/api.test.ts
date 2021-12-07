import chai from "chai";
import sqlite3 from "sqlite3";
import request from "supertest";

import buildSchemas from "../src/schemas";

const expect = chai.expect;

const db = new sqlite3.Database(":memory:");
import createApp from "../src/app";
import generateRide from "./helpers/generate-ride";
import seedRides from "./helpers/seed-rides";

const app = createApp(db);

describe("API tests", () => {
  before((done) => {
    db.serialize(() => {
      buildSchemas(db);

      seedRides(db);

      done();
    });
  });

  describe("GET /rides", () => {
    it("should return all rides", async () => {
      const response = await request(app).get("/rides").expect(200);

      expect(response.body.length).to.equal(10);
    });

    [
      { expectedLength: 2, pageNumber: 1, pageSize: 2 },
      { expectedLength: 5, pageNumber: 1, pageSize: 5 },
      { expectedLength: 1, pageNumber: 2, pageSize: 1 },
    ].forEach((params) => {
      it(`should return rides based on pagination pageSize=${params.pageSize},pageNumber=${params.pageNumber}`, async () => {
        const response = await request(app)
          .get(`/rides?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`)
          .expect(200);
        expect(response.body.length).to.equal(params.expectedLength);
      });
    });

    [
      { pageNumber: 1, pageSize: 'asdbf' },
      { pageNumber: 'adsfasdf', pageSize: 1 },
    ].forEach((params) => {
      it(`should return error pageNumber=${params.pageNumber},pageSize=${params.pageSize}`, async () => {
        await request(app)
          .get(`/rides?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`)
          .expect(400);
      });
    });
  });

  describe("GET /rides/:id", () => {
    it("should get specific ride", async () => {
      const response = await request(app).get(`/rides/${1}`).expect(200);

      expect(response.body.length).to.equal(1);

      expect(response.body[0].rideID).to.equal(1);
    });
  });

  describe("POST /rides", () => {
    it("should create specific ride", async () => {
      const rideData = generateRide()
      const response = await request(app).post(`/rides`).send({
        driver_name: rideData.driverName,
        driver_vehicle: rideData.driverVehicle,
        end_lat: rideData.endLat,
        end_long: rideData.endLong,
        rider_name: rideData.riderName,
        start_lat: rideData.startLat,
        start_long: rideData.startLong,
      }).expect(200);

      const createdRide = response.body[0];

      expect(createdRide.startLat).to.equal(rideData.startLat);
      expect(createdRide.startLong).to.equal(rideData.startLong);
      expect(createdRide.endLat).to.equal(rideData.endLat);
      expect(createdRide.endLong).to.equal(rideData.endLong);
      expect(createdRide.riderName).to.equal(rideData.riderName);
      expect(createdRide.driverName).to.equal(rideData.driverName);
      expect(createdRide.driverVehicle).to.equal(rideData.driverVehicle);
    });

    it('should throw an error', async () => {
      await request(app).post(`/rides`).send({
        driver_name: '',
        driver_vehicle: '',
        end_lat: -200,
        end_long: 400,
        rider_name: '',
        start_lat: 1000,
        start_long: 2000,
      }).expect(400);
    });
  });
});