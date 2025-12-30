import { getDB } from "../db";

export async function createStagesTable() {
  const db = await getDB();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS stages (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    );
    INSERT INTO stages 
        (id, name)
    VALUES 
        (1, 'Grupos 1'),
        (2, 'Grupos 2'),
        (3, 'Grupos 3'),
        (4, 'Octavos'),
        (5, 'Cuartos'),
        (6, 'Semifinal'),
        (7, 'Final');
  `);
}
