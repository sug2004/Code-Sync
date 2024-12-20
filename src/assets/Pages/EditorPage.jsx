
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from "react";
import Client from "../Components/Client.jsx";
import Editor from "../Components/Editor.jsx";
import { initSocket } from "../../socket.js";
import ACTIONS from "../../Action.js";
import toast from 'react-hot-toast';




function EditorPage() {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (!socketRef.current) {
        try {
          socketRef.current = await initSocket();

          socketRef.current.on("connect_error", handleErrors);
          socketRef.current.on("connect_failed", handleErrors);

          function handleErrors(e) {
            console.log("Socket error", e);
            toast.error("Socket connection failed, try again later.");
            reactNavigator("/");
          }

          socketRef.current.emit(ACTIONS.JOIN, {
            roomId,
            username: location.state?.username,
          });

          // Listening for the joined event
          socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
              toast.success(`${username} joined the room.`);
              console.log(`${username} joined`);
            }
            setClients(clients);
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          });

          // Listening for disconnected users
          socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
            toast.success(`${username} left the room.`);
            setClients((prev) =>
              prev.filter((client) => client.socketId !== socketId)
            );
          });
        } catch (error) {
          console.error("Socket initialization failed", error);
          toast.error("Unable to connect to the socket server.");
          reactNavigator("/");
        }
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current = null; // Reset to avoid reuse
      }
    };
  }, [reactNavigator, roomId, location.state]);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mainWrap bg-gray-900 grid grid-cols-[230px_1fr]">
      <div className="aside bg-[#1c1e29] p-4 text-white flex flex-col">
        <div className="asideInner flex-1">
          <h1 className="text-2xl font-semibold text-white p-5 border-b border-solid">
            Synchronize
          </h1>
          <h3 className="text-white pb-3">Connected</h3>
          <div className="clientList flex items-center flex-wrap gap-2">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button
          className="btn copyBtn w-full bg-white text-black py-2 rounded-lg m-1"
          onClick={copyRoomId}
        >
          Copy ROOM ID
        </button>
        <button
          className="btn leaveBtn w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition m-1"
          onClick={leaveRoom}
        >
          Leave
        </button>
      </div>
      <div className="editorWrap text-[20px] leading-[1.6]">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
}

export default EditorPage;