import * as service from '../services/pizzasService.js';
import { validateId } from '../validation.js';

export function list(req, res) {
  res.json(service.list());
}

export function get(req, res) {
  res.json(service.get(validateId(req.params.id)));
}

export async function create(req, res) {
  const pizza = await service.create(req.body);
  res.location(`/api/pizzas/${pizza.id}`).status(201).json(pizza);
}

export async function update(req, res) {
  res.json(await service.update(validateId(req.params.id), req.body));
}

export function remove(req, res) {
  service.remove(validateId(req.params.id));
  res.sendStatus(204);
}
