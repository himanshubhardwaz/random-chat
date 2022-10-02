import Button from "./Button";
import { useState } from "react";
import Ably from "ably/promises";
import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const ChatComponent: React.FC = () => {
  const { data: sessionData } = useSession();

  const email = sessionData?.user?.email;

  if (email) {
    configureAbly({
      key: process.env.ABLY_API_KEY,
      clientId: email,
      authUrl: `/api/createTokenRequest`,
    });
  }

  const getRoomDetails = async () => {
    return await (await fetch("/api/room")).json();
  };

  const { data } = useQuery(["joining-room-info"], getRoomDetails, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    onSuccess: () => {
      joinChannel();
    },
  });

  const joinRoom = async () => {
    return await (
      await fetch(`/api/room?channelName=${data?.channelName}&status=join`, {
        method: "PUT",
      })
    ).json();
  };

  const leaveRoom = async () => {
    return await (
      await fetch(`/api/room?channelName=${data?.channel}&status=leaveRoom`)
    ).json();
  };

  const { mutate: joinChannel, isSuccess: canJoinChannel } =
    useMutation(joinRoom);
  const { mutate: leaveChannel } = useMutation(leaveRoom);

  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<Array<Ably.Types.Message>>([]);

  const messageTextIsEmpty = messageText.trim().length === 0;

  const [channel] = useChannel(
    `${canJoinChannel ? data?.channelName : null}`,
    (msg: Ably.Types.Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    }
  );

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
    if (event.shiftKey) return;
    sendMessage(messageText);
    event.preventDefault();
  };

  if (!data) {
    return <>Loading...</>;
  }

  return (
    <div className='w-screen h-screen'>
      <div className='h-[90%] w-full'>
        {messages.map((msg) => (
          <div className='py-1 px-2' key={msg.id}>
            <span className='mr-2'>
              {msg.clientId === email ? (
                <span className='text-blue-600 font-semibold'>You: </span>
              ) : (
                <span className='text-red-600 font-semibold'>Stranger: </span>
              )}
            </span>
            <span className='whitespace-pre-line'>{msg.data.message}</span>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleFormSubmission}
        className='flex w-full items-center h-[10%]'
      >
        <Button type='submit' className='h-full text-white font-semibold'>
          Leave
        </Button>
        <textarea
          value={messageText}
          placeholder='Type a message...'
          onChange={(e) => setMessageText(e.target.value)}
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
