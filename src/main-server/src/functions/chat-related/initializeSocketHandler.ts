import { Socket } from "socket.io";
import o_newChats from "../../../../shared-network/globals/observables/chat-related/o_newChats";
import o_newMessages from "../../../../shared-network/globals/observables/chat-related/o_newMessages";
import { Subscription } from "rxjs";
import o_chatUpdate from "../../../../shared-network/globals/observables/chat-related/o_chatUpdate";
import o_newClientInventory from "../../../../shared-network/globals/observables/chat-related/o_newClientInventory";

export default function initializeSocketHandler(socket: Socket) {
  const subscriptions: Subscription[] = [];

  subscriptions.push(
    o_newChats.subscribe({
      next: (chat) => {
        socket.emit("newChat", chat);
      },
    })
  );

  subscriptions.push(
    o_newMessages.subscribe({
      next: (message) => {
        socket.emit("newMessage", message);
      },
    })
  );

  subscriptions.push(
    o_chatUpdate.subscribe({
      next: (update) => {
        socket.emit("chatUpdate", update);
      },
    })
  );

  subscriptions.push(
    o_newClientInventory.subscribe({
      next: (inventoy) => {
        socket.emit("newClientInventory", inventoy);
      },
    })
  );
  socket.on("disconnect", () => {
    subscriptions.forEach((s) => s.unsubscribe());
  });
}
