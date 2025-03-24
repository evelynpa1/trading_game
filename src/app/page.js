"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
// Mock starting data

const initialState = {
  hand: [0],
  table: [0, 0, 0, 0],
  players: new Map(),
  round: 0
};

initialState.players.set(1, {id: 1, card: 0, buy: 2, sell:5})

export default function Home() {
  const [gameState, setGameState] = useState(initialState);

  useEffect(() => {
    // Establish WebSocket connection to the server
    const socket = new WebSocket('ws://localhost:8080');
    let clientId = localStorage.getItem("clientId");
    socket.onopen = () => {
      console.log("Connected to server");
      if (clientId) console.log(clientId);
      else console.log("No client id, new connection");
      socket.send(JSON.stringify({
        event: clientId ? "reconnect" : "new_player",
        id: clientId
      }));
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      // console.log( data);

      if (data.event === "assign_id") {
        clientId = data.id;
        console.log("HERE" + clientId);
        localStorage.setItem("clientId", clientId);
        console.log("Assigned new ID:", clientId);
      } else if (data.event === "reconnect_success") {
        console.log("Reconnected with ID:", clientId);
      } else if (data.event === "game_start") {
        console.log("Game starting! Players:", data.players);
      }
    };

    // Handle incoming messages from the server (e.g., game state update)
    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   console.log("Recieved message")
    //   console.log(data)
    //   if (data.type === 'TABLE_UPDATE') {
    //     // Update the game state with the new table data
    //     setGameState((prevState) => ({
    //       ...prevState,
    //       table: [...data.table], // Assuming server sends a 'table' object
    //     }));
    //   }

    //   // Handle other message types if needed
    //   if (data.type === 'PLAYER_UPDATE') {
    //     setGameState((prevState) => ({
    //       ...prevState,
    //       players: data.players, // Update players list
    //     }));
    //   }
    // };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
      console.log('Connection closed');
    };

    // Clean up WebSocket connection when the component is unmounted
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="p-4 space-y-6">
      <Players players={gameState.players} current={gameState.round} />
      <Table table={gameState.table} />
      {console.log("Rendered Table:", gameState.table)}
      <Hand hand={gameState.hand} />
      {gameState.round == 0 && <MarketInput maxWidth={20} onSubmit={({ buy, sell }) => {
        console.log('Submitted Market:', buy, sell);
        // Optionally update gameState here
      }} />}
    </div>
  );
}

export function MarketInput({ onSubmit, maxWidth }) {
  const [buy, setBuy] = useState("");
  const [sell, setSell] = useState("");

  const handleSubmit = () => {
    if (!buy || !sell) {
      alert("Invalid market: Both buy and sell must be filled.");
      return;
    }
    if (parseInt(buy) <= 0 || parseInt(sell) <= 0) {
      alert("Invalid market: Both buy and sell must be greater than 0.");
      return;
    }
    if (parseInt(buy) >= parseInt(sell)) {
      alert("Invalid market: Buy must be less than or equal to Sell.");
      return;
    }
    if (parseInt(sell) - parseInt(buy) > maxWidth) {
      alert("Invalid market: The current max width of the market is " + maxWidth + ".");
      return;
    }
    onSubmit({ buy: parseInt(buy), sell: parseInt(sell) });

  };

  return (
    <div className="text-center mt-4">
      <div className="mb-2 font-bold">Enter Your Market</div>
      <input
        className="border p-1 mx-2 w-16 text-center"
        type="number"
        min="1"
        placeholder="Buy"
        value={buy}
        onChange={(e) => setBuy(e.target.value)}
      />
      <input
        className="border p-1 mx-2 w-16 text-center"
        type="number"
        min="1"
        placeholder="Sell"
        value={sell}
        onChange={(e) => setSell(e.target.value)}
      />
      <button
        className="ml-4 px-4 py-1 bg-blue-500 text-white rounded"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}


export function Players({ players, current }) {
  return (
    <div className="flex justify-center space-x-4">
      {[...players].map(([key, player]) => (
        <div
          key={player.id}
          className={`p-2 border rounded text-center w-24 ${1 === current ? "bg-yellow-100" : "bg-gray-100"
            }`}
        >
          <div>Player {player.id}</div>
          <div className="text-2xl">{player.card}</div>
          <div className="text-xs mt-1">Buy: {player.buy} Sell: {player.sell}</div>
        </div>
      ))}
    </div>
  );
}

export function Table({ table }) {
  return (
    <div className="text-center">
      <div className="mb-2">Table Cards</div>
      <div className="flex justify-center space-x-4">
        {table.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
}

export function Hand({ hand }) {
  return (
    <div className="text-center">
      <div className="mb-2">Your Hand</div>
      <div className="flex justify-center space-x-4">
        {hand.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
}

export function Card({ card }) {
  return (
    <div className="border border-black rounded p-4 w-12 h-16 flex items-center justify-center text-xl bg-white">
      {card}
    </div>
  );
}
