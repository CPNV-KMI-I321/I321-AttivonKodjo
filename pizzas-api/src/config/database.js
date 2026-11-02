import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const path = process.env.DB_PATH || './data/pizzas.sqlite';
if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true });
export const db = new DatabaseSync(path);
db.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS pizzas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL CHECK (price >= 0),
    imageUrl TEXT
  );
  CREATE UNIQUE INDEX IF NOT EXISTS pizzas_unique_name ON pizzas(name COLLATE NOCASE);
  CREATE TABLE IF NOT EXISTS pizza_ingredients (
    pizza_id INTEGER NOT NULL REFERENCES pizzas(id) ON DELETE CASCADE,
    ingredient_id INTEGER NOT NULL,
    PRIMARY KEY (pizza_id, ingredient_id)
  );
`);

export function transaction(action) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = action();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}
