import { getDB } from "../db";

export async function createWorldcupTable() {
  const db = await getDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS worldcup (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stage INTEGER NOT NULL,
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    )
  `);
}
