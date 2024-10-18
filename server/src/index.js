import app from "./app.js";
import connectDb from "./db/connection.js";
import { localPort } from "./const.js";
import { createServer } from "http";
import { Server } from "socket.io";
import chatSocketHandler from "./sockets/chat.js";

const server = createServer(app);

 export let io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const PORT = process.env.PORT || localPort;

// Start the server
const startServer = async () => {
  try {
    await connectDb();

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    app.on("error", (err) => {
      console.error(`Server encountered an error: ${err.message}`);
    });
  } catch (error) {
    console.error(`Error starting the server: ${error.message}`);
    process.exit(1);
  }
};
startServer();


// Setup Socket.IO events
io.on("connection", (socket) => {
  chatSocketHandler(io, socket);
});


// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Closed out remaining connections.');
    process.exit(0);
  });

  // Force close connections after 10 seconds
  setTimeout(() => {
    console.error('Forcing shutdown...');
    process.exit(1);
  }, 10000);
});