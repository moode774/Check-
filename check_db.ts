import Database from "better-sqlite3";
const db = new Database("sakanyemen.db");
const properties = db.prepare("SELECT id, title, images FROM properties").all();
console.log(JSON.stringify(properties, null, 2));
