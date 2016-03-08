'use strict';

const Hapi = require('hapi');
const Path = require('path');

const server = new Hapi.Server({
  connections: {
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '..', 'client/dist')
      }
    }
  }
});
server.connection({ port: 9000 });

server.register([require('inert')], err => {

  server.route({
    method: 'GET',
    path: '/',
    config: {
      handler: {
        file: 'index.html'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, '..', 'client/dist')
      }
    }
  });

  server.ext('onPreResponse', function (request, reply) {

    if (request.response.isBoom) {
      // Inspect the response here, perhaps see if it's a 404?
      return reply.file('index.html');
    }

    return reply.continue();
  });



  server.start(err => {
    if (err) {
      throw err;
    }
  });
});
