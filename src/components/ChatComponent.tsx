import Button from "./Button";
import { useState } from "react";
import Ably from "ably/promises";
import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import { v4 as uuidv4 } from "uuid";

configureAbly({
  key: process.env.ABLY_API_KEY,
  clientId: uuidv4(),
  authUrl: `/api/createTokenRequest`,
});

const ChatComponent: React.FC = () => {
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<Array<Ably.Types.Message>>([]);

  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel] = useChannel("random-chat", (msg: Ably.Types.Message) => {
    setMessages((prevMessages) => [...prevMessages, msg]);
  });

  const sendMessage = (msg: string) => {
    channel.publish("chat-message", { message: msg });
    setMessageText("");
  };

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(messageText);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key !== "Enter" || messageTextIsEmpty) {
      return;
    }
    sendMessage(messageText);
    event.preventDefault();
  };

  return (
    <div className='w-screen h-screen'>
      <div className='h-[90%] w-full'>{JSON.stringify(messages)}</div>
      <form
        onSubmit={handleFormSubmission}
        className='flex w-full items-center h-[10%]'
      >
        <textarea
          value={messageText}
          placeholder='Type a message...'
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className='px-4 py-2 w-full border-2 h-full'
          autoFocus
        />
        <Button type='submit' className='h-12 text-white'>
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
