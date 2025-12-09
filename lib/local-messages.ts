import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const messagesFilePath = path.join(process.cwd(), "lib", "local-messages.json");

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export async function readMessages(): Promise<Message[]> {
  try {
    if (!fs.existsSync(messagesFilePath)) {
      await writeMessages([]);
      return [];
    }
    const data = fs.readFileSync(messagesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading messages:", error);
    return [];
  }
}

export async function writeMessages(messages: Message[]): Promise<void> {
  try {
    const dir = path.dirname(messagesFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
  } catch (error) {
    console.error("Error writing messages:", error);
    throw error;
  }
}

export async function createMessage(messageData: {
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  subject: string;
  message: string;
}): Promise<Message> {
  const messages = await readMessages();
  const newMessage: Message = {
    id: uuidv4().substring(0, 9),
    senderId: messageData.senderId,
    senderName: messageData.senderName,
    receiverId: messageData.receiverId,
    receiverName: messageData.receiverName,
    subject: messageData.subject,
    message: messageData.message,
    read: false,
    createdAt: new Date().toISOString(),
  };
  messages.push(newMessage);
  await writeMessages(messages);
  return newMessage;
}

export async function getMessagesForUser(userId: string): Promise<Message[]> {
  const messages = await readMessages();
  return messages.filter(
    (msg) => msg.senderId === userId || msg.receiverId === userId
  );
}

export async function markMessageAsRead(messageId: string): Promise<Message | null> {
  const messages = await readMessages();
  const messageIndex = messages.findIndex((msg) => msg.id === messageId);
  
  if (messageIndex === -1) {
    return null;
  }
  
  messages[messageIndex].read = true;
  await writeMessages(messages);
  return messages[messageIndex];
}
