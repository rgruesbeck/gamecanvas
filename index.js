// Game
import config from './config.json';

import {
    requestAnimationFrame,
    cancelAnimationFrame
} from './helpers/animationframe.js';

import {
    loadList,
    loadImage,
    loadSound,
    loadFont
} from './helpers/loaders.js';

import Overlay from './helpers/overlay.js';
import Player from './gamecharacters/player.js';

class Game {

    constructor(canvas, overlay, config) {
        this.config = config; // our customizations

        this.canvas = canvas; // our game screen
        this.ctx = canvas.getContext("2d"); // our game screen context
        this.canvas.width = window.innerWidth; // set our game screen width
        this.canvas.height = window.innerHeight; // set our game screen height

        this.overlay = new Overlay(overlay);

        // game settings

        this.screen = {
            top: 0,
            bottom: this.canvas.height,
            left: 0,
            right: this.canvas.width,
            centerX: this.canvas.width / 2,
            centerY: this.canvas.height / 2,
        };

        this.gamePaused = false; // game paused or not (true, false)
        this.gameState = {
            current: 'ready',
            prev: ''
        }; // our game state (ready, play, win, over)
        this.frame = 0; // our count of frames just like in a movie

        this.images = {}; // place to keep our images
        this.sounds = {}; // place to keep our sounds
        this.fonts = {}; // place to keep our fonts

        this.player = null;
        this.enemies = {};

        // keyboard input
        this.input = {
            up: false,
            right: false,
            left: false,
            down: false
        };

        // listen for keyboard input
        document.addEventListener('keydown', ({ code }) => this.handleKeyboardInput('keydown', code), false);
        document.addEventListener('keyup', ({ code }) => this.handleKeyboardInput('keyup', code), false);

        // listen for button clicks
        this.overlay.root.addEventListener('click', () => {
            this.overlay.hideButton(); // hide button

            // game state is ready
            // set game state to play
            if (this.gameState.current === 'ready') {
                this.setGameState('play');
            }

            // game state is over:
            // reset game and set to play
            if (this.gameState.current === 'over') {
                this.reset();
            }

            // game state is win:
            // reset game and set to play
            if (this.gameState.current === 'win') {
                this.reset();
            }


        }, false);
    }

    load() {
        // here we will load all our assets
        // pictures, sounds, and fonts we need for our game

        // make a list of assets we want to load
        const gameAssets = [
            loadImage('topImage', this.config.images.topImage),
            loadSound('backgroundMusic', this.config.sounds.backgroundMusic),
            loadFont('gameFont', this.config.style.fontFamily)
        ];

        loadList(gameAssets)
            .then((assets) => {

                this.images = assets.image; // attach the loaded images
                this.sounds = assets.sound; // attach the loaded sounds
                this.fonts = assets.font; // attach the loaded fonts

                this.create();
            });
    }

    create() {
        // here we will create our game characters

        // set our overlay styles
        this.overlay.setStyles({
            textColor: red,
            primaryColor: primary,
            fontFamily: 'Courier New'
        })

        this.player = new Player();

        this.play();
    }

    play() {
        // each time play() is called, we will update the positions
        // of our game character and paint a picture and then call play() again
        // this way we will create an animation just like the pages of a flip book
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears the screen of the last picture

        // draw and do stuff that you always need to do
        // no matter the game state

        // ready to play
        if (this.gameState.current === 'ready') {

        }

        // player wins
        if (this.gameState.current === 'win') {

        }

        // game over
        if (this.gameState.current === 'over') {

        }

        // game play
        if (this.gameState.current === 'play') {
            // game in session

        }

        // paint the next screen
        this.frame = requestAnimationFrame(() => this.play());
    }

    handleKeyboardInput(type, code) {

        if (type === 'keydown') {
            if (code === 'ArrowUp') {
                this.input.up = true
            }
            if (code === 'ArrowRight') {
                this.input.right = true
            }
            if (code === 'ArrowDown') {
                this.input.down = true
            }
            if (code === 'ArrowLeft') {
                this.input.left = true
            }
        }

        if (type === 'keyup') {
            if (code === 'ArrowUp') {
                this.input.up = false
            }
            if (code === 'ArrowRight') {
                this.input.right = false
            }
            if (code === 'ArrowDown') {
                this.input.down = false
            }
            if (code === 'ArrowLeft') {
                this.input.left = false
            }

            if (code === 'Space') {
                this.pause();
            } // spacebar: pause and play game
        }
    }

    pause() {
        if (this.gamePaused) {
            this.gamePaused = false;
            requestAnimationFrame(() => this.play());
            this.overlay.hideButton();
        } else {
            this.gamePaused = true;
            cancelAnimationFrame(this.frame);
            this.overlay.showButton('Paused');
        }
    }

    setGameState(state) {
        this.gameState = {
            ...this.gameState,
            ...{
                current: state,
                prev: this.gameState.current
            }
        };
    }

    reset() {
        document.location.reload();
    }
}

const screen = document.getElementById("game");
const overlay = document.getElementById("overlay");
const game = new Game(screen, overlay, config); // here we create a fresh game
game.load(); // and tell it to start