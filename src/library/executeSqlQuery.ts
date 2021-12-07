/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from 'sqlite3';

export default async function (
  db: Database,
  query: string,
  operation: string,
  values?: unknown
): Promise<any> {
  return new Promise(function (resolve, reject) {
    if (operation === "insert" && values) {
      db.run(query, values, function (err) {
        if (err) {
          return reject(err);
        }
        resolve(this.lastID);
      });
    } else if (operation === "query" && values) {
      db.all(query, values, function (err, rows) {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    }
  });
}