export const getLastChatContent = (chatArray) => {
  if (chatArray.length === 0) return null;
  const lastChat = chatArray[chatArray.length - 1];
  return lastChat.content;
};


export const userChatFilterRecever = (chat, newUserId) => {
  console.log(chat.some((chat) => chat.chat === newUserId))
  return chat.some((chat) => chat.chat === newUserId);
};