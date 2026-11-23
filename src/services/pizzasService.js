import { db } from '../config/database.js';
import * as Pizza from '../entities/Pizza.js';
import * as PizzaComposition from '../entities/PizzaComposition.js';
import * as IngredientsService from './ingredientsService.js';
import { fail, validateId, validatePizza } from '../validation.js';

function inTransaction(operation) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = operation();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    try {
      db.exec('ROLLBACK');
    } catch (rollbackError) {
      throw new AggregateError([error, rollbackError], 'Échec de la transaction et de son annulation.');
    }
    throw error;
  }
}

function ensureUniqueName(name, exceptId) {
  const existing = Pizza.findByName(name);
  if (existing && existing.id !== exceptId) fail(409, 'Une pizza portant ce nom existe déjà.');
}

export function list() {
  return Pizza.findAll();
}

export function get(id) {
  const pizza = Pizza.findById(validateId(id));
  if (!pizza) fail(404, 'Pizza introuvable.');
  return pizza;
}

export function create(body) {
  const pizza = validatePizza(body);
  return inTransaction(() => {
    ensureUniqueName(pizza.name);
    IngredientsService.ensureExist(pizza.ingredientIds);
    const created = Pizza.create(pizza);
    PizzaComposition.replace(created.id, pizza.ingredientIds);
    return Pizza.findById(created.id);
  });
}

export function update(id, body) {
  const pizzaId = validateId(id);
  const pizza = validatePizza(body);
  return inTransaction(() => {
    if (!Pizza.findById(pizzaId)) fail(404, 'Pizza introuvable.');
    ensureUniqueName(pizza.name, pizzaId);
    IngredientsService.ensureExist(pizza.ingredientIds);
    Pizza.update(pizzaId, pizza);
    PizzaComposition.replace(pizzaId, pizza.ingredientIds);
    return Pizza.findById(pizzaId);
  });
}

export function remove(id) {
  if (!Pizza.remove(validateId(id))) fail(404, 'Pizza introuvable.');
}
