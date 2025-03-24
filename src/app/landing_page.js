/*
(0) Landing Page
[Create Game] -> GOTO (1.1)
[Join Game] -> GOTO (1.2)

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