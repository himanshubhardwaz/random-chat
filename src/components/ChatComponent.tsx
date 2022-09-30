import Button from "./Button";

const ChatComponent: React.FC = () => {
  return (
    <div className='w-screen h-screen'>
      <div className='h-[90%] w-full'>Main chatting space</div>
      <div className='flex w-full items-center h-[10%]'>
        <textarea
          className='px-4 py-2 w-full border-2 h-full'
          placeholder='Type here'
          autoFocus
        />
        <Button className='h-12 text-white'>Send</Button>
      </div>
    </div>
  );
};

export default ChatComponent;
