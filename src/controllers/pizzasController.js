import * as PizzasService from '../services/pizzasService.js';

export function list(req, res) {
  res.json(PizzasService.list());
}

export function get(req, res) {
  res.json(PizzasService.get(req.params.id));
}

export function create(req, res) {
  const pizza = PizzasService.create(req.body);
  res.location(`/api/pizzas/${pizza.id}`).status(201).json(pizza);
}

export function update(req, res) {
  res.json(PizzasService.update(req.params.id, req.body));
}

export function remove(req, res) {
  PizzasService.remove(req.params.id);
  res.sendStatus(204);
}
