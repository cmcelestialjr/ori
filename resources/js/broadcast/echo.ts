import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "axios";
import api from "../components/api/axios";

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<"pusher">;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "e92e55bb0352e1ecf154",
  cluster: "ap1",
  forceTLS: true,

  authorizer: (channel: { name: string }) => {
    return {
      authorize: async (
        socketId: string,
        callback: (error: boolean, data?: unknown) => void,
      ) => {
        try {
          const res = await api.post(
            "http://localhost:8000/broadcasting/auth",
            {
              socket_id: socketId,
              channel_name: channel.name,
            },
          );

          callback(false, res.data);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            callback(true, error.response);
          }
        }
      },
    };
  },
});

export default echo;
