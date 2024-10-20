import { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { reLogin:{authenticat,authenticatData} } = useSelector(
    (state) => state.auth
  );
  useEffect(() => {
    if (authenticat) {
      const socket = io(import.meta.env.VITE_SERVER_API_URL, {
        query: {
          userId: authenticatData?._id,
        },
      });

      setSocket(socket);

      socket?.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authenticatData,authenticat]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
