/*
(0) Landing Page
[Create Game] -> GOTO (1.1)
[Join Game] -> GOTO (1.2)
*/
"use client";
import { useState } from "react";

export default function landingPage(){
    // 0 = main menu, 1 = create, 2  = join 
    const [step, setStep] = useState(0);
    const [totalPlayers, setTotalPlayers] = useState("");
    const [numBots, setNumBots] = useState("");


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 space-y-8">
            <h1 className="text-4xl font-bold">Welcome to the Trading Game</h1>
            {step === 0 && (
        <div className="space-y-4 text-center">
          <button
            className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => setStep(1)}
          >
            Create Game
          </button>
          <div className="text-gray-500">or</div>
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setStep(2)}
          >
            Join Game
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Create Game</h2>
      
        <div>
          <label className="block mb-1">Total Number of Players:</label>
          <input
            type="number"
            className="border p-2 w-32 text-center"
            value={totalPlayers}
            min="1"
            onChange={(e) => setTotalPlayers(e.target.value)}
          />
        </div>
      
        <div>
          <label className="block mb-1">Number of Bots:</label>
          <input
            type="number"
            className="border p-2 w-32 text-center"
            value={numBots}
            min="0"
            onChange={(e) => setNumBots(e.target.value)}
          />
        </div>
      
        <button
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
          onClick={() => {
            const total = parseInt(totalPlayers);
            const bots = parseInt(numBots);
            if (isNaN(total) || isNaN(bots)) {
              alert("Please enter valid numbers.");
              return;
            }
            if (bots > total) {
              alert("Bots cannot exceed total number of players.");
              return;
            }
      
            console.log(`Total players: ${total}`);
            console.log(`Number of bots: ${bots}`);
            console.log(`Human players: ${total - bots}`);
          }}
        >
          Submit
        </button>
      
        <button
          onClick={() => setStep(0)}
          className="text-sm text-blue-600 underline block mt-2"
        >
          ← Back to Menu
        </button>
      </div>
      
      )}

      {step === 2 && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Join Game</h2>
          <p>• Enter game code</p>
          <p>• Enter your name</p>
          <p>Join as:</p>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-purple-500 text-white rounded">
              Player
            </button>
            <button className="px-4 py-2 bg-gray-400 text-white rounded">
              Spectator
            </button>
          </div>
          <div>
            <button
              onClick={() => setStep(0)}
              className="text-sm text-blue-600 underline mt-4"
            >
              ← Back to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );

}

/*
(1.1) [Start Game]
- Choose number of players
- Choose number of bots??
- Choose game code -> VALIDATE
- Choose spectator password
- Would you like to:
[Player] -> GOTO (-1)
[Spectate] -> GOTO (3)


(1.2) [Start]
give them a share link
GOTO (-1)


(2.1) [Join Game]
- Enter game code
- Enter your name

(2.2)
Join as:
[Player] -> GOTO (-1)
[Spectator]


(3) [Spectator]
Enter spectator password
join the game as viewer, let them see the game, all of the cards, etc


(-1) Game is started
Automatically have them join the game as a client (page.js)
*/