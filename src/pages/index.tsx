import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ChatComponent = dynamic(() => import("@/components/ChatComponent"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <Suspense fallback={`Loading...`}>
      <ChatComponent />
    </Suspense>
  );
};

export default Home;
