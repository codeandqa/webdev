/**
 * I'm a super simple chat server you can run with node
 * 	node chat-server.js
 *
 * Interact with me:
 *
 * Data format:
  {
		user: 'root',
		message: '---Welcome---'
	}
 *
 * https://www.npmjs.com/package/ws#sending-and-receiving-text-data
 */
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3030 });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on("connection", ws => {
  console.log('server received new connection')
  ws.on('close', () => {
    console.log('this connection closed')
  })
  ws.on("message", message => {
    console.log("ws received: %s", message);

    // send to the sender
    //ws.send(message);

    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.send(
    JSON.stringify({
      user: "root",
      message: "---Welcome---"
    })
  );
});
