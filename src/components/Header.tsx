import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <header className='bg-gray-300 flex justify-between items-center py-4'>
      <div className='font-semibold text-red-500 text-xl px-2'>Random Chat</div>
      <div
        className='font-semibold text-red-500 text-xl px-2 cursor-pointer'
        onClick={() => signOut()}
      >
        Logout
      </div>
    </header>
  );
}
