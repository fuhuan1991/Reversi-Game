# Reversi Game
https://fuhuan1991.github.io/Reversi-Game/index.html

## Intro
- This is a little game based on Reversi.
https://en.wikipedia.org/wiki/Reversi
 ![预览](https://github.com/fuhuan1991/Reversi-Game/blob/master/p12.png)
- Players take turns placing pieces on the board. After a move, any pieces of the opponent's color that are in the middle of newly placed piece and other current player's pieces will be turned to current player's piece.

- If a move cannot reverse opponent's pieces, then it is invalid. The green zone on the board shows all the valid moves current player can perform.

- Players take alternate turns. If one player can not make a valid move, play passes back to the other player. When neither player can move, the game ends. This occurs when the grid has filled up or when neither player can legally place a piece in any of the remaining squares.

- The object of the game is to have the majority of disks turned to display your color when the last playable empty square is filled.

- This game contains both 1 player mode and 2 players mode. If you play alone, you play as tail and you move first, computer play as head.

## Main Ideas
- Minimax & alpha-beta pruning
- Grabing corner is critical in this game. The algorithm will grab a corner whenever possible and prevent the human player from doing so. 
- Some pieces are reversible in many directions, some are only reversible from a certain angle and others are impossible to reverse. The algorithm would try not only to capture more pieces but also to capture more hard-to-reverse pieces.

## Tech Stack
- React
- TypeScript
- Sass
- Antd
 
 
 ## How to run:
 npm install
 
 npm run start
 
