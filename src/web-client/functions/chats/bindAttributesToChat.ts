import ActiveChatModel from "../../../models/ActiveChatModel";
import o_newMessages from "../../../shared-network/globals/observables/chat-related/o_newMessages";
import { filter } from "rxjs/operators";
import UpdatingSubject from "../../../classes/rxjs-extending/UpdatingSubject";
import ClientActiveChatModel from "../../models/ClientActiveChat";
import messageShouldHaveAttention from "./messageShouldHaveAttention";
import bindMessageJSXBuilder from "./initial-loading/bindMessageJSXBuilder";

export default function bindAttributesToChat(chat: UpdatingSubject<ClientActiveChatModel>) {
  const value = chat.value;
  o_newMessages
    .pipe(filter((m) => m.clientId === value.clientId && m.partnerId === value.partnerId && messageShouldHaveAttention(m)))
    .subscribe({ next: () => chat.update((c) => ({ ...c, isChecked: false })) });

  bindMessageJSXBuilder(value.clientId, value.partnerId);
}
