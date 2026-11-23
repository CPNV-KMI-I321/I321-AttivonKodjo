import { db } from '../config/database.js';
import * as PizzaComposition from './PizzaComposition.js';

function withComposition(pizza) {
  return pizza && { ...pizza, ingredientIds: PizzaComposition.ingredientIds(pizza.id) };
}

export function findAll() {
  return db.prepare('SELECT * FROM pizzas ORDER BY id').all()
    .map(withComposition);
}

export function findById(id) {
  return withComposition(db.prepare('SELECT * FROM pizzas WHERE id = ?').get(id));
}

export function create({ name, description, price, imageUrl }) {
  const result = db.prepare(`
    INSERT INTO pizzas (name, description, price, imageUrl) VALUES (?, ?, ?, ?)
  `).run(name, description, price, imageUrl);
  return findById(Number(result.lastInsertRowid));
}

export function update(id, { name, description, price, imageUrl }) {
  db.prepare(`UPDATE pizzas SET name = ?, description = ?, price = ?, imageUrl = ? WHERE id = ?`)
    .run(name, description, price, imageUrl, id);
  return findById(id);
}

export function remove(id) {
  return db.prepare('DELETE FROM pizzas WHERE id = ?').run(id).changes > 0;
}

export function findByName(name) {
  return withComposition(db.prepare('SELECT * FROM pizzas WHERE name = ? COLLATE NOCASE').get(name));
}
