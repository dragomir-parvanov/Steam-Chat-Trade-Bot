import { RequestHandler } from "express";
import socketio from "socket.io";
import g_cachedLoggedUsers from "../../passport/g_cachedLoggedUsers";
import initializeSocketHandler from "../../functions/chat-related/initializeSocketHandler";
export default function configureSocketIO(server: any, sessionMiddleware: RequestHandler) {
  const io = socketio(server).use((socket, next) => {
    sessionMiddleware(socket.request, {} as never, next);
  });

  io.on("connection", (socket) => {
    const user = g_cachedLoggedUsers[socket.request?.session.username];
    initializeSocketHandler(socket);
    console.log(socket.request?.session.username);
    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });
}
