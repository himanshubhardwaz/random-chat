import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <header className='bg-gray-300 fixed w-screen flex justify-between'>
      <div className='font-semibold text-red-500 text-xl px-2 py-3'>
        Random Chat
      </div>
      <div
        className='font-semibold text-red-500 text-xl px-2 py-3 cursor-pointer'
        onClick={() => signOut()}
      >
        Logout
      </div>
    </header>
  );
}
