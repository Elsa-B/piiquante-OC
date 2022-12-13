//Commande pour importer http
const http = require('http');
//Commande pour importer app.js
const app = require('./app');
//Renvoie d'un port valide que se soit un nbr ou une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort('3000');
//Dire à l'application express sur quel port elle doit fonctionner
app.set('port', port);
//Recherche les différentes erreurs, les gère de manière appropriée.
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
//Création du serveur
const server = http.createServer(app);
//Ecouteur d'évènement
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});
//Le serveur écoute le port 3000
server.listen(port);