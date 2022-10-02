import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import Loading from "@/components/Loading";

const ChatComponent = dynamic(() => import("@/components/ChatComponent"), {
  ssr: false,
});

const Home: NextPage = () => {
  const { status } = useSession();

  if (status === "unauthenticated") {
    signIn();
  }

  if (status === "loading") return <Loading />;

  return (
    <Suspense fallback={`Loading...`}>
      <ChatComponent />
    </Suspense>
  );
};

export default Home;
