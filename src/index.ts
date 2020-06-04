import ws from 'ws';
import express from 'express';
import http from 'http';
import { readdirSync } from 'fs';
import path from 'path';
import { networkInterfaces } from 'os';
import crypto from 'crypto';

import ClientResponse, { MessagePurpose, ClientResponseBody } from './client-response';
import MinecraftEvent from './event';
import { parseCommand, uuidGenerator } from './common';
import { Player, Position, Commands, TargetSelector } from './type';
import command from './command';

const app = express();
const server = new http.Server(app);
const wss = new ws.Server({ server });

const CRYPTO_ALGORITHM = 'aes-256-cfb8';
const keyRaw = crypto.scryptSync('123456', '78910', 32);
const key = keyRaw.toString('base64');
const ivRaw = crypto.randomBytes(16);
const iv = ivRaw.toString('base64');
const cipher = crypto.createCipheriv(CRYPTO_ALGORITHM, keyRaw, ivRaw);
const decipher = crypto.createDecipheriv(CRYPTO_ALGORITHM, keyRaw, ivRaw);
let commandRequestQueue: { [key: string]: string } = {};

global.player = new Player();

wss.on('connection', socket => {
  console.log('user connected');

  // socket.send(command.getEduClientInfo());
  // socket.send(command.enableEncryption(key, iv));
  Object.entries(MinecraftEvent).forEach(([key, event]) => socket.send(eventSubscribe(event)));

  const agentCreateUuid = uuidGenerator();
  socket.send(command.agentCreate(agentCreateUuid));
  commandRequestQueue[agentCreateUuid] = 'agentCreate';
  const getPlayerInfoUuid = uuidGenerator();
  socket.send(command.queryTarget(TargetSelector.Self, getPlayerInfoUuid));
  commandRequestQueue[getPlayerInfoUuid] = 'getPlayerInfo';

  socket.on('message', listner => {
    const response: ClientResponse = JSON.parse(listner.toString());
    console.log(JSON.stringify(response));

    switch (response.header.messagePurpose) {
      case MessagePurpose.Event: {
        const body = response.body as ClientResponseBody;
        switch (body.eventName) {
          case MinecraftEvent.PlayerMessage: {
            const command = body.properties.Message;
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
              body.properties.PlayerGameMode,
              body.properties.PlayerId,
              body.properties.PlayerYRot,
              new Position(
                body.properties.PosX,
                body.properties.PosY,
                body.properties.PosZ
              )
            )
            console.log(global.player);
            break;
          }
        }
        break;
      }
      case MessagePurpose.CommandResponse: {
        if (response.header.requestId in commandRequestQueue) {
          switch (commandRequestQueue[response.header.requestId]) {
            case 'agentCreate': {
              break;
            }
            case 'getPlayerInfo': {
              const data: { dimention: number, position: { x: number, y: number, z: number }, uniqueId: string, yRot: number } = JSON.parse((response.body as any).details)[0];
              global.player.Position = new Position(data.position.x, data.position.y, data.position.z);
              global.player.YRotation = data.yRot;
              console.log(global.player);
              break;
            }
            default: {
              break;
            }
          }
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
    requestId: uuidGenerator(),
    messagePurpose: MessagePurpose.Subscribe,
    version: 1,
    messageType: MessagePurpose.CommandRequest,
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