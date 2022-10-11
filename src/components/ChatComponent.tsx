import Button from "./Button";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSocket } from "@/contexts/SocketContext";

const ChatComponent: React.FC = () => {
  const { isConnected, error, chat } = useSocket();

  const [message, setMessage] = useState<string>("");

  const sendMessage = (msg: string) => {
    // call api
    setMessage("");
  };

  const messageIsEmpty = message.trim().length === 0;

  const handleFormSubmission = (event: React.FormEvent) => {
    event.preventDefault();
    sendMessage(message);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (
      event.key !== "Enter" ||
      (event.shiftKey && event.key === "Enter") ||
      messageIsEmpty
    ) {
      return;
    }
    sendMessage(message);
    event.preventDefault();
  };
  return (
    <div className='w-screen h-screen'>
      <div className='h-[90%] w-full'>{JSON.stringify(chat)}</div>
      <form
        onSubmit={handleFormSubmission}
        className='flex w-full items-center h-[10%]'
      >
        <Button type='submit' className='h-full text-white font-semibold'>
          Leave
        </Button>
        <textarea
          value={message}
          placeholder='Type a message...'
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className='px-4 py-2 w-full border-2 h-full resize-none'
          autoFocus
        />
        <Button type='submit' className='h-full text-white font-semibold'>
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
