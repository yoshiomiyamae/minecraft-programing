import ws from 'ws';
import express from 'express';
import http from 'http';
import { readdirSync } from 'fs';
import path from 'path';
import { networkInterfaces } from 'os';

import ClientResponse from './client-response';
import MinecraftEvent from './event';
import { uuid, parseCommand } from './common';
import { Player, Position } from './type';
import command from './command';

const app = express();
const server = new http.Server(app);
const wss = new ws.Server({ server });
global.player = new Player();

wss.on('connection', socket => {
  console.log('user connected');
  console.log(socket);

  Object.entries(MinecraftEvent).forEach(([key, event]) => socket.send(eventSubscribe(event)));
  socket.send(command.tp('~', '~', '~'))

  socket.on('message', listner => {
    const response: ClientResponse = JSON.parse(listner.toString());
    console.log(JSON.stringify(response));

    if (response.header.messagePurpose === 'event') {
      switch (response.body.eventName) {
        case MinecraftEvent.PlayerMessage: {
          const command = response.body.properties.Message;
          switch (command) {
            // you can add here embeded command
            default: {
              // plugin or just say
              const commandAndArgs = parseCommand(command);
              if (commandAndArgs) {
                const plugins = readdirSync(path.join(__dirname, 'plugins')).filter(value => value.endsWith('.ts'));
                if (plugins.includes(`${commandAndArgs.Command}.ts`)) {
                  import(`./plugins/${commandAndArgs.Command}`).then(commandPlugin => {
                    commandPlugin.run(socket, commandAndArgs);
                  });
                }
              }
              break;
            }
          }
          break;
        }
        case MinecraftEvent.PlayerTransform: {
          global.player.setAll(
            response.body.properties.PlayerGameMode,
            response.body.properties.PlayerId,
            response.body.properties.PlayerYRot,
            new Position(
              response.body.properties.PosX,
              response.body.properties.PosY,
              response.body.properties.PosZ
            )
          )
          console.log(global.player);
          break;
        }
      }
    }
  });

  socket.on('unexpected-response', listner => {
    console.log(listner.method);
  });
});

const eventSubscribe = (event: MinecraftEvent) => JSON.stringify({
  body: {
    eventName: event,
  },
  header: {
    requestId: uuid(),
    messagePurpose: 'subscribe',
    version: 1,
    messageType: 'commandRequest',
  },
});

server.listen(3000, () => {
  const interfaces = networkInterfaces();
  const iface = Object.keys(interfaces).map(key => interfaces[key]?.filter(details => !details.internal && details.family === 'IPv4')).filter(value => value?.length !== 0);
  if (iface && iface[0]) {
    const ipV4Address = iface[0][0].address;
    console.log(`listening on 0.0.0.0:3000. Copy this command to Minecraft: /connect ${ipV4Address}:3000`);
  }
});