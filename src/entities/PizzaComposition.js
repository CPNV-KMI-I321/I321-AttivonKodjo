import { db } from '../config/database.js';

export function ingredientIds(pizzaId) {
  return db.prepare(`
    SELECT ingredient_id
    FROM pizza_ingredients
    WHERE pizza_id = ?
    ORDER BY ingredient_id
  `).all(pizzaId).map(row => row.ingredient_id);
}

export function replace(pizzaId, ids) {
  db.prepare('DELETE FROM pizza_ingredients WHERE pizza_id = ?').run(pizzaId);
  const insert = db.prepare(`
    INSERT INTO pizza_ingredients (pizza_id, ingredient_id) VALUES (?, ?)
  `);
  for (const ingredientId of ids) insert.run(pizzaId, ingredientId);
}

export function isUsed(ingredientId) {
  return Boolean(db.prepare(`
    SELECT 1 FROM pizza_ingredients WHERE ingredient_id = ? LIMIT 1
  `).get(ingredientId));
}
