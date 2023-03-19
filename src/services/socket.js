import { io } from "socket.io-client";
import { Config } from "src/utils/constants";

const socket = () => {
  const token = window.sessionStorage.getItem("access-token");

  const sock = io(Config.BASE_URL, {
    auth: {
      token,
    },
  });
  return sock;
};

export default socket;
