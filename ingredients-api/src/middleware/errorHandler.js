export default function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.message.includes('UNIQUE constraint failed: pizzas.name')) {
    error.status = 409;
    error.message = 'Ce nom de pizza existe déjà.';
  }
  if (error.message.includes('FOREIGN KEY constraint failed')) {
    error.status = 409;
    error.message = 'Cette ressource est encore utilisée.';
  }
  const status = error.status || 500;
  if (status >= 500) console.error(error.message);
  res.status(status).json({ error: status === 500 ? 'Erreur interne du serveur.' : error.message });
}
