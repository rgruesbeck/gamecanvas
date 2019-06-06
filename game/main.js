/**
 * game/main.js
 * 
 * What it Does:
 *   This file is the main game class
 *   Important parts are the load, create, and play functions
 *   
 *   Load: is where images, sounds, and fonts are loaded
 *   
 *   Create: is where game elements and characters are created
 *   
 *   Play: is where game characters are updated according to game play
 *   before drawing a new frame to the screen, and calling play again
 *   this creates an animation just like the pages of a flip book
 * 
 *   Other parts include boilerplate for requesting and canceling new frames
 *   handling input events, pausing, muting, etc.
 * 
 * What to Change:
 *   Most things to change will be in the play function
 */

import Koji from 'koji-tools';

import {
    requestAnimationFrame,
    cancelAnimationFrame
} from './helpers/animationFrame.js';

import {
    loadList,
    loadImage,
    loadSound,
    loadFont
} from './helpers/assetLoaders.js';

import {
    hashCode
} from './utils/baseUtils.js'

import {
    resize
} from './utils/imageUtils.js';

import {
    onSwipe
} from './utils/inputUtils.js'

import {
    testConfig
} from './utils/testUtils.js'

import Player from './characters/player.js';

class Game {

    constructor(canvas, overlay, topbar, config) {
        this.config = config; // customization
        this.overlay = overlay;
        this.topbar = topbar;

        testConfig(config);

        this.prefix = hashCode(this.config.settings.name); // set prefix for local-storage keys

        this.canvas = canvas; // game screen
        this.ctx = canvas.getContext("2d"); // game screen context

        // setup event listeners
        // handle keyboard events
        document.addEventListener('keydown', ({ code }) => this.handleKeyboardInput('keydown', code));
        document.addEventListener('keyup', ({ code }) => this.handleKeyboardInput('keyup', code));

        // setup event listeners for mouse movement
        document.addEventListener('mousemove', ({ clientY }) => this.handleMouseMove(clientY));

        // setup event listeners for mouse movement
        document.addEventListener('touchmove', ({ touches }) => this.handleTouchMove(touches[0]));

        // handle overlay clicks
        this.overlay.root.addEventListener('click', ({ target }) => this.handleClicks(target));

        // handle swipes
        document.addEventListener('touchstart', ({ touches }) => this.handleSwipe('touchstart', touches[0]));
        document.addEventListener('touchmove', ({ touches }) => this.handleSwipe('touchmove', touches[0]));
        document.addEventListener('touchend', ({ touches }) => this.handleSwipe('touchend', touches[0]));

        // handle resize events
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener("orientationchange", (e) => this.handleResize(e));
        
        // handle koji config changes
        Koji.on('change', (scope, key, value) => {
            this.config[scope][key] = value;
            this.cancelFrame(this.frame.count - 1);
            this.load();
        });

    }

    init() {
        // frame count, rate, and time
        // this is just a place to keep track of frame rate (not set it)
        this.frame = {
            count: 0,
            time: Date.now(),
            rate: null,
            scale: null
        };

        // game settings
        this.state = {
            current: 'loading',
            prev: '',
            score: 0,
            lives: parseInt(this.config.settings.lives),
            paused: false,
            muted: localStorage.getItem(this.prefix.concat('muted')) === 'true'
        };

        this.input = {
            active: 'keyboard',
            keyboard: { up: false, right: false, left: false, down: false },
            mouse: { x: 0, y: 0, click: false },
            swipe: { },
            touch: { x: 0, y: 0 },
        };

        this.images = {}; // place to keep images
        this.sounds = {}; // place to keep sounds
        this.fonts = {}; // place to keep fonts

        this.player = {};

        // set topbar and topbar color
        this.topbar.active = this.config.settings.gameTopBar;
        this.topbar.style.display = this.topbar.active ? 'block' : 'none';
        this.topbar.style.backgroundColor = this.config.colors.primaryColor;

        // set canvas
        this.canvas.width = window.innerWidth; // set game screen width
        this.canvas.height = this.topbar.active ? window.innerHeight - this.topbar.clientHeight : window.innerHeight; // set game screen height

        // set screen
        this.screen = {
            top: 0,
            bottom: this.canvas.height,
            left: 0,
            right: this.canvas.width,
            centerX: this.canvas.width / 2,
            centerY: this.canvas.height / 2,
            scale: ((this.canvas.width + this.canvas.height) / 2) * 0.003
        };

        // set document body to backgroundColor
        document.body.style.backgroundColor = this.config.colors.backgroundColor;

        // set loading indicator to textColor
        document.querySelector('#loading').style.color = this.config.colors.textColor;


    }

    load() {
        // load pictures, sounds, and fonts
    
        if (this.sounds && this.sounds.backgroundMusic) { this.sounds.backgroundMusic.pause(); } // stop background music when re-loading

        this.init(); // apply new configs
        
        // make a list of assets
        const gameAssets = [
            loadImage('playerImage', this.config.images.playerImage),
            loadImage('backgroundImage', this.config.images.backgroundImage),
            loadSound('backgroundMusic', this.config.sounds.backgroundMusic),
            loadFont('gameFont', this.config.settings.fontFamily)
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

        let playerSize = resize({ image: playerImage, height: 60 * scale });

        this.player = new Player({
            ctx: this.ctx,
            image: playerImage,
            x: centerX - playerSize.width / 4,
            y: centerY,
            width: playerSize.width,
            height: playerSize.height,
            speed: 50,
            bounds: this.screen
        });

        // set overlay styles
        this.overlay.setStyles({...this.config.colors, ...this.config.settings});

        this.setState({ current: 'ready' });
        this.play();
    }

    play() {
        // update game characters

        // clear the screen of the last picture
        this.ctx.fillStyle = this.config.colors.backgroundColor; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // draw and do stuff that you need to do
        // no matter the game state
        this.ctx.drawImage(this.images.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        // update score and lives
        this.overlay.setLives(this.state.lives);
        this.overlay.setScore(this.state.score);

        // ready to play
        if (this.state.current === 'ready') {

          if (this.state.prev === 'loading') {

            this.overlay.hide('loading');
            this.canvas.style.opacity = 1;

            this.overlay.setBanner(this.config.settings.name);
            this.overlay.setButton(this.config.settings.startText);
            this.overlay.setInstructions({
                desktop: this.config.settings.instructionsDesktop,
                mobile: this.config.settings.instructionsMobile
            });

            this.overlay.show('stats');

            this.overlay.setMute(this.state.muted);
            this.overlay.setPause(this.state.paused);

            this.setState({ current: 'ready' });
          }

        }

        // game play
        if (this.state.current === 'play') {

            // if last state was 'ready'
            // hide overlay items
            if (this.state.prev === 'ready') {
                this.overlay.hide(['banner', 'button', 'instructions'])
            }

            if (!this.state.muted) { this.sounds.backgroundMusic.play(); }

            // player bounce
            let ddy = Math.cos(this.frame.count / 5) / 20;

            // move player with keyboard
            if (this.input.active === 'keyboard') {
                let { up, right, down, left } = this.input.keyboard;

                let dx = (left ? -1 : 0) + (right ? 1 : 0);
                let dy = (up ? -1 : 0) + (down ? 1 : 0);

                this.player.move(dx, dy + ddy, this.frame.scale);
            }

            if (this.input.active === 'touch') {
                let { x, y } = this.input.touch;
                let { cx, cy } = this.player;

                let dx = (x - cx) / (x * 2);
                let dy = (y - cy) / (y * 2);

                this.player.move(dx, dy + ddy, this.frame.scale);
            }

            this.player.draw();
        }

        // player wins
        if (this.state.current === 'win') {
            // win code

        }

        // game over
        if (this.state.current === 'over') {
            // game over code

        }

        // draw the next screen
        this.requestFrame(() => this.play());
    }

    // event listeners
    handleClicks(target) {
        if (this.state.current === 'loading') { return; }
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

            // if defaulting to have sound on by default
            // double mute() to warmup iphone audio here
            this.mute();
            this.mute();
        }

    }

    handleKeyboardInput(type, code) {
        this.input.active = 'keyboard';

        if (type === 'keydown' && this.state.current === 'play') {
            if (code === 'ArrowUp') {
                this.input.keyboard.up = true
            }
            if (code === 'ArrowRight') {
                this.input.keyboard.right = true
            }
            if (code === 'ArrowDown') {
                this.input.keyboard.down = true
            }
            if (code === 'ArrowLeft') {
                this.input.keyboard.left = true
            }
        }

        if (type === 'keyup' && this.state.current === 'play') {
            if (code === 'ArrowUp') {
                this.input.keyboard.up = false
            }
            if (code === 'ArrowRight') {
                this.input.keyboard.right = false
            }
            if (code === 'ArrowDown') {
                this.input.keyboard.down = false
            }
            if (code === 'ArrowLeft') {
                this.input.keyboard.left = false
            }

            if (code === 'Space') {
                this.pause(); // pause
            }
        }

        // start game on read
        if (type === 'keydown' && this.state.current === 'ready') {
            this.setState({ current: 'play' });
        }

        // reload on game over
        if (type === 'keydown' && this.state.current === 'over') {
            this.load();
        }

    }

    handleMouseMove(y) {
        this.input.active = 'mouse';
        this.input.mouse.y = y;
    }

    handleTouchMove(touch) {
        let { clientX, clientY } = touch;

        this.input.active = 'touch';
        this.input.touch.x = clientX;
        this.input.touch.y = clientY;
    }

    // handle swipe
    handleSwipe(type, touch) {
        // get a swipe after 5 touch moves
        onSwipe(type, touch, 5, (swipe) => {

            // do something with the swipe
            this.input.swipe = swipe;
        });
    }

    handleResize() {

        document.location.reload();
    }

    // pause game
    pause() {
        if (this.state.current != 'play') { return; }

        this.state.paused = !this.state.paused;
        this.overlay.setPause(this.state.paused);

        if (this.state.paused) {
            // pause game loop
            this.cancelFrame(this.frame.count - 1);

            // mute all game sounds
            Object.keys(this.sounds).forEach((key) => {
                this.sounds[key].muted = true;
                this.sounds[key].pause();
            });

            this.overlay.setBanner('Paused');
        } else {
            // resume game loop
            this.requestFrame(() => this.play(), true);

            // resume game sounds if game not muted
            if (!this.state.muted) {
                Object.keys(this.sounds).forEach((key) => {
                    this.sounds[key].muted = false;
                    this.sounds.backgroundMusic.play();
                });
            }

            this.overlay.hide('banner');
        }
    }

    // mute game
    mute() {
        let key = this.prefix.concat('muted');
        localStorage.setItem(
            key,
            localStorage.getItem(key) === 'true' ? 'false' : 'true'
        );
        this.state.muted = localStorage.getItem(key) === 'true';

        this.overlay.setMute(this.state.muted);

        if (this.state.muted) {
            // mute all game sounds
            Object.keys(this.sounds).forEach((key) => {
                this.sounds[key].muted = true;
                this.sounds[key].pause();
            });
        } else {
            // unmute all game sounds
            // and play background music
            // if game not paused
            if (!this.state.paused) {
                Object.keys(this.sounds).forEach((key) => {
                    this.sounds[key].muted = false;
                    this.sounds.backgroundMusic.play();
                });
            }
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
    // wraps requestAnimationFrame.
    // see game/helpers/animationframe.js for more information
    requestFrame(next, resumed) {
        let now = Date.now();
        this.frame = {
            count: requestAnimationFrame(next),
            time: now,
            rate: resumed ? 0 : now - this.frame.time,
            scale: this.screen.scale * this.frame.rate * 0.01
        };
    }

    // cancel frame
    // wraps cancelAnimationFrame.
    // see game/helpers/animationframe.js for more information
    cancelFrame() {
        cancelAnimationFrame(this.frame.count);
    }
}

export default Game;
