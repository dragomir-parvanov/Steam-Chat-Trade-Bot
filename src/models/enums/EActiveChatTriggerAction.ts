
/**
 * From what action the chat became active.
 * @export
 * @enum {number}
 */
export enum EActiveChatTriggerAction{
    
    /**
     * The chat got activated from friend list scanning
     */
    Scanning,

    /**
     * The chat got activated from a message from a friend
     */
    FriendMessage,
}