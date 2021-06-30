# Play Thud

Thud is a game described by Terry Pratchett in his novel, Thud!.

The game simulates a battle between the Dwarves (in blue) and the Trolls (in green) on an
octagonal board with the Thudstone (an impassable space) in the centre of the board.

I have created an environment to play the game and develop game playing code at: https://ajfaraday.github.io/Thud/dist/index.html

The challenge is to write the most successful dwarf or troll player of this game (these will be two separate challenges).

# Rules

Starting with the Dwarves, players take it in turns to move.

## Dwarf Movement

On the Dwarf player's turn, they can move one dwarf piece either as a walk or a hurl.

*Walk*: Dwarves can move as far as they like in any direction until they hit an obstacle
(another dwarf, the edge of the board, or a troll). 
They can only kill a troll by walking if they are only one space away.

*Hurl*: If two or more dwarves are in a line (horizontal, vertical or diagonal), they can hurl the dwarf on the end of the line, by
the length of the line (e.g. in a line of 3, the dwarf on the end can be hurled 3 spaces). 
If a dwarf is hurled into a troll, the troll is killed, reducing the trolls score by 4 points. 

## Troll Movement

On the Troll player's turn they can  move one troll piece, either as a walk or a shove. 

*Walk*: Trolls can move one space in any direction, unless a troll or the edge of the 
board is in the way. Whenever a troll moves, it kills all dwarves on or adjacent to 
it's destination space.

*Shove*: If two or more trolls are in a line (horizontal, vertical or diagonal) they can shove the troll 
at the end of the line that number of spaces away, but *only* if the target space, or any of it's immediate 
neighbours contain a dwarf. Whenever a troll moves, it kills all dwarves on or adjacent to
it's destination space.

It is not permitted for a troll to land directly on a dwarf by either walk or shove moves.

Each dwarf killed reduces the dwarves score by 1 point.

## Scores

The score is calculated thus:

* The dwarf player has one point for every dwarf remaining on the board.
* The troll player has four points for every troll remaining on the board.
* The key figure is the difference between these two.

## Ending the game

The game ends when any of these conditions is met:

* There are no dwarves on the board.
* There are no trolls on the board.
* Both players have declared the game over.
* The game has reached it's cut-off length of 500 moves.

# How to play a game

* Go to https://ajfaraday.github.io/Thud/dist/index.html
* Hover the mouse over a piece to see it's available moves.
* Click a piece to select it for the current move.
* Click one of the available moves to move the piece.
* (You can click the relevant 'Make Peace' button to declare the game over according to that player, during their turn)

# How to set up a local instance of the game

You don't have to clone the repository and use it locally to make the game work, or to create an entry, 
but it helps.

* `git clone git@github.com:AJFaraday/Thud.git`
* `cd Thud`
* `npm install`
* You can then call `node script/get_clients.js` to get the latest entries from Stack Exchange

If you prefer, you can use the github pages instance at https://ajfaraday.github.io/Thud/dist/index.html

# How to customize a game

* Open /dist/index.html in your browser
* Click 'Customize'
* Select troll and dwarf clients (manual allows direct control)
* Select a turn time in milliseconds (only relevant to non-manual players)
* Click 'Run Game' to see or play the game.
* (Clicking 'Close' will not enact any changes)

# Clients

The game is played by clients, which represent either a troll or a dwarf player. Each is a 
JavaScript class which must have these three functions:

* `constructor(controller)` - controller is an object which acts as your interface with the game (see below).
* `turn()` - This is called whenever it is your players turn to move.
* `end_turn()` - This is called after your player's turn is over. It can not move pieces, but can make 
  decisions on whether or not to declare the game over.
  
## Controller

The `controller` object is your client's interface with the game itself. You can find full documentation
for the controller class here: https://github.com/AJFaraday/Thud/blob/main/docs/controller_interface.md

It provides these methods to interrogate the state of the game:

* `turn()` - Current turn of the game
* `scores()` - The current score
* `spaces()` - Every space, and what's in it
* `space_info(x, y)` - Detailed information on any space on the board.
* `dwarves()` - The location of every dwarf
* `trolls()` - The location of every troll
* `pieces()` - All pieces belonging to the current player (equivalent of `dwarves()` or `trolls()`)  
* `indexed_dwarves()` - The location of every dwarf with a fixed index
* `indexed_trolls()` - The location of every troll with a fixed index
* `previous_move()` - What got moved to where last turn
* `killing_moves()` - All moves which can kill one or more opponent
* `current_space` - Currently selected space (not a function)
* `clear_space()` - Empties currently selected space

These methods are used to actually make your move:

* `check_space(x, y)`- Find out what moves are available from a given space
* `select_space(x, y)` - The player decides to move a piece at space.
* `check_move(x, y)` - Find out what will happen if you move to a place
* `move(x, y)` - The player moves the current piece to the selected space.

These are concerned with ending the game:

* `declare(game_over)` - Say whether or not your player thinks the game is over.
* `opponent_declared()` - Has the opponent declared the game over?

# How to write a client

Warning: There is an issue with the project on Firefox (https://github.com/AJFaraday/Thud/issues/3) 
which prevents editing the code in the browser. This has been confirmed to work in Chrome.

* Open 'dist/index.html' in your browser. 
* Click 'Customize'.
* Select 'default/template' as the Dwarf player (or use another client as a starting point).
* Click 'Edit' beside the Dwarf player select.
* Write your client code in the text box provided.
* The Validate button will change colour based on whether or not the client is passes validations (see below).
* When you're happy with it, click 'Save' (This can be done before it passes validation, but it may not actually work).
* Select a worthy opponent and click 'Run Game' to see the game.

## Validations

In order for a client to work, and therefore be enterable in the challenge, it has to pass these
validations:

* It must evaluate as Javascript code.
* The code must return a class, with a constructor which accepts one argument.
* Instances of this class should have functions named `turn()` and `end_turn()`
* The client must play a game until it is over (i.e. it must call a valid `move` during every `turn` call).
The validator will run games against default opponents to determine if this happens.
* Does not have any forbidden terms
** `game.` - Only interact with the game via controller
** `Math.random` - Please keep it deterministic
** `setTimeout` or `setInterval` - Keep it sequential   
  
You can open the developer console (F12) to see more detailed information on your client's 
validation process.

## How to save a client

If you have cloned the git repository, you can save your entry for future tinkering. This
step is not required for entry in the challenge, but it may be helpful.

* Edit a client, as above. 
* When you're happy with it (preferably if it's passing validation, too), click 'Copy'
* Create a .js file in `/src/clients/dwarf/entry` with the name of your entry e.g. `/src/clients/dwarf/entrygreat_dwarf_player.js`. 
  (This folder will not be wiped by `get_clients.js`)
* Run `node script/get_clients.js` from the Thud directory to make your entry available from
the Dwarf player select. (This will also import the latest entries from Stack Exchange)
  
## How to enter your client in the competition

* Decide on the name of your client, your client_name must only have alpha characters and underscores.
* Answer this question with your entry
  * The first line of your answer should be your client's name as a title (with = characters under it on the second line)
  * There should be a code block containing the class for your entry (with or without the preceeding `module.exports =`)
* After that please include a brief explanation of your client's behaviour, and any other information you'd like to include.

Once this is in place, running `node script/get_clients.js` will make your client available under your username.

The GitHub Pages instance will also be updated periodically. So by making an entry, your code
will be added to the repo.

According to the rules, after playing a game, the players swap sides, so please also write an entry on the 
Troll/Dwarf challenge.

# Tournament rules

The tournament will pit every available dwarf client (in `/src/clients/dwarf/(defaut|entry|answers)`) against 
every available troll client (in `/src/clients/troll/(defaut|entry|answers)`), and each pairing will play
exactly one game.

The *difference* between the two players' scores will then update a running total
for each client. The winner will gain the difference, and the loser will lose the difference.

There are two winners in the tournament, the most successful troll player and the most
successful dwarf player. 

