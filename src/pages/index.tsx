import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import Button from "@/components/Button";

const ChatComponent = dynamic(() => import("@/components/ChatComponent"), {
  ssr: false,
});

const Home: NextPage = () => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    return (
      <div className='h-screen w-screen flex items-center justify-center flex-col gap-8'>
        <p>Login/Signup to continue using app</p>
        <Button onClick={() => signIn("google")}>Login / Signup</Button>
      </div>
    );
  }

  if (status === "loading") return <Loading />;

  return (
    <Suspense fallback={`Loading...`}>
      <Header />
      <ChatComponent />
    </Suspense>
  );
};

export default Home;
