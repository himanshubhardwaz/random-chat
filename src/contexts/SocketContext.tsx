import {
  useContext,
  createContext,
  useState,
  useEffect,
  useReducer,
} from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";

type Chat = {
  user?: { email: string };
  message?: string;
};

type SOCKETCONNECTIONTYPE = {
  isConnected: boolean;
  isReconnecting: boolean;
  isError: boolean;
  error: string;
  strangerId: string;
};

const initialState: SOCKETCONNECTIONTYPE = {
  isConnected: false,
  isReconnecting: false,
  isError: false,
  error: "",
  strangerId: "",
};

type SOCKETACTIONTYPE =
  | { type: "connected" }
  | { type: "disconnected" }
  | { type: "error"; payload?: string }
  | { type: "reconnecting" }
  | { type: "reconnecting-successful" }
  | { type: "set-room-id"; payload: string }
  | { type: "reset" };

function reducer(state: SOCKETCONNECTIONTYPE, action: SOCKETACTIONTYPE) {
  switch (action.type) {
    case "connected":
      return { ...state, isConnected: true };
    case "disconnected":
      return { ...state, isConnected: false };
    case "error":
      return {
        ...state,
        isConnected: false,
        error: action?.payload ? action.payload : "Something went wrong",
        isError: true,
      };
    case "reconnecting":
      return { ...state, isConnected: false, isReconnecting: true };
    case "reconnecting-successful":
      return { ...state, isConnected: true, isReconnecting: false };
    case "set-room-id":
      return { ...state, strangerId: action.payload };
    case "reset":
      return { ...initialState };
    default:
      throw new Error("Invalid action type");
  }
}

interface socketType {
  isConnected: boolean;
  isReconnecting: boolean;
  isError: boolean;
  error: string;
  strangerId: string;
  chat?: Array<Chat>;
  findMatch?: () => void;
}

const SocketContext = createContext<socketType>(initialState);

export const useSocket = () => {
  return useContext(SocketContext);
};

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();

  const [state, dispatch] = useReducer(reducer, initialState);

  const [chat, setChat] = useState<Array<Chat>>([]);

  const [socket] = useState(() =>
    io("/api/socket", {
      reconnectionDelayMax: 10000,
      query: {
        email: session?.data?.user?.email,
      },
      autoConnect: false,
    })
  );

  const findMatch = () => {
    if (state?.isConnected) {
      socket.emit("find-match");
    }
  };

  const matchFoundListener = (args: any) => {
    console.log("matchFoundListener: " + args);
  };

  const messageReceivedListener = (args: any) => {
    console.log("messageReceivedListener: " + args);
  };

  useEffect(() => {
    if (session.status === "authenticated" && session?.data?.user?.email) {
      if (!state.isConnected) {
        socket.connect();
      }

      socket.on("connect", () => {
        dispatch({ type: "connected" });
        socket.on("match-found", matchFoundListener);
        socket.on("message-received", messageReceivedListener);
      });

      socket.io.on("error", (error) => {
        dispatch({ type: "error", payload: error.message });
      });

      socket.io.on("reconnect_attempt", () => {
        dispatch({ type: "reconnecting" });
      });

      socket.io.on("reconnect", () => {
        dispatch({ type: "reconnecting-successful" });
      });

      socket.io.on("reconnect_error", (error) => {
        dispatch({ type: "error", payload: error.message });
      });

      socket.io.on("reconnect_failed", () => {
        dispatch({ type: "error", payload: "Could not reconnect" });
      });
    }

    if (socket && state?.isConnected) {
      return () => {
        socket.disconnect();
        dispatch({ type: "reset" });
      };
    }
  }, [session?.data?.user?.email, session.status, socket, state.isConnected]);

  const value = {
    ...state,
    chat,
    findMatch,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
