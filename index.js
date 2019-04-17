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

import { getSmoother } from './helpers/utils.js'

import Overlay from './helpers/overlay.js';
import Player from './gamecharacters/player.js';

class Game {

    constructor(canvas, overlay, config) {
        this.config = config; // customizations

        this.canvas = canvas; // game screen
        this.ctx = canvas.getContext("2d"); // game screen context
        this.canvas.width = window.innerWidth; // set game screen width
        this.canvas.height = window.innerHeight; // set game screen height

        this.overlay = new Overlay(overlay);

        // frame count and rate
        // just a place to keep track of frame rate (not set it)
        this.frame = {
            count: 0,
            rate: 60,
            time: Date.now()
        };

        // game settings
        this.state = {
            current: 'ready',
            prev: 'loading',
            paused: false,
            muted: true
        };

        this.input = {
            active: 'keyboard',
            keyboard: { up: false, right: false, left: false, down: false },
            mouse: { x: 0, y: 0, click: false },
            touch: { x: 0, y: 0 },
        };

        this.screen = {
            top: 0,
            bottom: this.canvas.height,
            left: 0,
            right: this.canvas.width,
            centerX: this.canvas.width / 2,
            centerY: this.canvas.height / 2,
            scale: ((this.canvas.width + this.canvas.height) / 2) * 0.003
        };

        this.images = {}; // place to keep images
        this.sounds = {}; // place to keep sounds
        this.fonts = {}; // place to keep fonts

        this.player = {};
        this.enemies = {};

        // setup event listeners
        // handle keyboard events
        document.addEventListener('keydown', ({ code }) => this.handleKeyboardInput('keydown', code), false);
        document.addEventListener('keyup', ({ code }) => this.handleKeyboardInput('keyup', code), false);

        // handle overlay clicks
        this.overlay.root.addEventListener('click', ({ target }) => this.handleClicks(target), false);

        // handle resize events
        window.addEventListener('resize', () => this.handleResize(), false);

        // handle post message
        window.addEventListener('message', (e) => this.handlePostMessage(e), false);
    }

    load() {
        // here will load all assets
        // pictures, sounds, and fonts
        
        // make a list of assets
        const gameAssets = [
            loadImage('playerImage', this.config.images.playerImage),
            loadSound('backgroundMusic', this.config.sounds.backgroundMusic),
            loadFont('gameFont', this.config.style.fontFamily)
        ];

        // put the loaded assets the respective containers
        loadList(gameAssets)
        .then((assets) => {

            this.images = assets.image;
            this.sounds = assets.sound;

        })
        .then(() => this.create());
    }

    create() {

        // create game characters
        const { scale, centerX, centerY } = this.screen;
        const { playerImage } = this.images;


        let playerHeight = 90 * scale;
        let playerWidth = 90 * scale;

        this.player = new Player(
            this.ctx, playerImage,
            centerX - playerWidth / 4, centerY,
            playerHeight, playerWidth
        );
        this.player.setBounds(this.screen)

        // set overlay styles
        this.overlay.setStyles(config.style);

        this.play();
    }

    play() {
        // each time play() is called, update the positions of game character,
        // and paint a picture and then call play() again
        // this will create an animation just like the pages of a flip book

        // clear the screen of the last picture
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw and do stuff that you need to do
        // no matter the game state

        // ready to play
        if (this.state.current === 'ready') {

            this.overlay.showBanner('Game');
            this.overlay.showButton('Play');
            this.overlay.showStats();
            this.overlay.setLives('10');
            this.overlay.setScore('10');

            this.overlay.setMute(this.state.muted);
            this.overlay.setPause(this.state.paused);

        }

        // game play
        if (this.state.current === 'play') {
            if (!this.state.muted) { this.sounds.backgroundMusic.play(); }

            let dy = 10 * Math.cos(this.frame.count/ 60);
            let dx = 5 * Math.cos(this.frame.count/ 30);

            this.player.move(dx, dy, this.frame.scale);
            this.player.draw();
        }

        // player wins
        if (this.state.current === 'win') {

        }

        // game over
        if (this.state.current === 'over') {

        }

        // paint the next screen
        this.requestFrame();
    }

    start() {

    }

    // event listeners

    handleClicks(target) {

        // mute
        if (target.id === 'mute') {
            this.mute();
        }

        // pause
        if (target.id === 'pause') {
            this.pause();
        }

        // button
        if ( target.id === 'button') {
            this.setState({ current: 'play' });
            this.overlay.hideBanner();
            this.overlay.hideButton();
        }

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

            // spacebar: pause and play game
            if (code === 'Space') {
                this.pause();
            }
        }
    }

    handleResize() {

        document.location.reload();
    }

    handlePostMessage(e) {
        // for koji messages
        // https://gist.github.com/rgruesbeck/174d29f244494ead21e2621f6f0d79ee

        console.log('postmesage');
    }

    // game helpers
    // pause game
    pause() {
        this.state.paused = !this.state.paused;
        this.overlay.setPause(this.state.paused);

        if (this.state.paused) {
            this.cancelFrame();
            this.overlay.showBanner('Paused');
        } else {
            this.requestFrame();
            this.overlay.hideBanner();
        }
    }

    // mute game
    mute() {
        this.state.muted = !this.state.muted; // toggle muted
        this.overlay.setMute(this.state.muted); // update mute display

        if (this.state.muted) {
            // mute all game sounds
            Object.keys(this.sounds).forEach((key) => {
                this.sounds[key].muted = true;
                this.sounds[key].pause();
            });
        } else {
            // unmute all game sounds
            // and play background music
            Object.keys(this.sounds).forEach((key) => {
                this.sounds[key].muted = false;
                this.sounds.backgroundMusic.play();
            });
        }
    }

    // reset game
    reset() {
        document.location.reload();
    }

    // update game state
    setState(state) {
        this.state = {
            ...this.state,
            ...{ prev: this.state.current },
            ...state,
        };
    }

    // request new frame
    requestFrame() {
        let now = Date.now();
        this.frame = {
            count: requestAnimationFrame(() => this.play()),
            rate: now - this.frame.time,
            time: now,
            scale: this.screen.scale * this.frame.rate * 0.01
        };
    }

    // don't request new frame
    cancelFrame() {
        cancelAnimationFrame(this.frame.count);
    }
}

const screen = document.getElementById("game");
const overlay = document.getElementById("overlay");
const game = new Game(screen, overlay, config); // here we create a fresh game
game.load(); // and tell it to start