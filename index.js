/**
 * index.js
 * 
 * What it Does:
 *   This file gets the #gameScreen and #gameOverlay elements in index.html,
 *   attaches a new game and a overlay to them, and starts the game.
 *   It also loads the .internals/config.json which is a bundle of current customizations
 *   to the json files in the .koji directory
 * 
 * What to Change:
 *   Not much to change here unless besides renaming the 
 * 
 * How to Use:
 *   Make sure this file has a script tag in index.html
 *   eg. <script src="./index.js"></script>
 */

// import the config containing customizations, Game, and Overlay
import config from '.internals/config.json';
import Game from './game/main.js';
import Overlay from './game/overlay.js';

// create get the gameScreen and gameOverlay elements
// gameScreen is the <canvas> element where the game is displayed
// gameOverlay is where the where start button, score, lives,
// play and pause buttons etc will be displayed
const gameScreen = document.getElementById("gameScreen");
const gameOverlay = document.getElementById("gameOverlay");

// create new overlay for game
// create new game and load it
const overlay = new Overlay(gameOverlay)
const game = new Game(gameScreen, overlay, config);
game.load();