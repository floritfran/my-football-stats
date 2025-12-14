import { getDB } from "../db";

export async function createMatchesTable() {
  const db = await getDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      result TEXT NOT NULL,
      goals INTEGER DEFAULT 0,
      asists INTEGER DEFAULT 0,
      shirt TEXT DEFAULT NULL,
      date INTEGER NOT NULL DEFAULT (strftime('%s','now'))
    )
  `);
}
