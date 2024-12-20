import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = () => {
    if (!roomId.trim() || !username.trim()) {
      toast.error("ROOM ID & Username are required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") joinRoom();
  };

  return (
    <div className="bg-gray-900 flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Synchronize
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Realtime collaboration
        </p>

        <form>
          <div className="mb-4">
            <label
              htmlFor="room-id"
              className="block text-sm text-gray-400 mb-2"
            >
              ROOM ID
            </label>
            <input
              id="room-id"
              type="text"
              placeholder="ROOM ID"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="username"
              className="block text-sm text-gray-400 mb-2"
            >
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              placeholder="USERNAME"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="button"
            onClick={joinRoom}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
          >
            Join
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            If you don’t have an invite, create{" "}
            <a
              href="#"
              onClick={createNewRoom}
              className="text-green-500 border-b border-green-500 hover:text-green-600 hover:border-green-600 transition duration-300"
            >
              a new room
            </a>
          </p>
        </div>
      </div>

      <footer className="absolute bottom-4 text-center w-full">
        <p className="text-xs text-gray-400">
          Built by <span className="text-green-500">Sugrish</span>
        </p>
      </footer>
    </div>
  );
};

export default Home;
