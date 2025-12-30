import * as SQLite from "expo-sqlite";

const DB_NAME = "sql_db";
let db: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync(DB_NAME);
    await db.execAsync("PRAGMA foreign_keys = ON;");
  }
  return db;
}
