import chai from "chai";
import sqlite3 from "sqlite3";
import request from "supertest";

import buildSchemas from "../src/schemas";

const expect = chai.expect;

const db = new sqlite3.Database(":memory:");
import createApp from "../src/app";
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
      { expectedLength: 1, pageNumber: 1, pageSize: 1 },
    ].forEach((params) => {
      it(`should return rides based on pagination pageSize=${params.pageSize},pageNumber=${params.pageNumber}`, async () => {
        const response = await request(app)
          .get(`/rides?pageSize=${params.pageSize}&pageNumber=${params.pageNumber}`)
          .expect(200);
        expect(response.body.length).to.equal(params.expectedLength);
      });
    });
  });
});