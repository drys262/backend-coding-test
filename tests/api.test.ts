import sqlite3 from "sqlite3";
import request from "supertest";

import buildSchemas from "../src/schemas";

const db = new sqlite3.Database(":memory:");
// eslint-disable-next-line @typescript-eslint/no-var-requires
import createApp from "../src/app";
const app = createApp(db);

describe("API tests", () => {
  before((done) => {
    db.serialize(() => {
      buildSchemas(db);

      done();
    });
  });

  describe("GET /health", () => {
    it("should return health", (done) => {
      request(app)
        .get("/health")
        .expect("Content-Type", /text/)
        .expect(200, done);
    });
  });
});
