/**
 * game/utils/inputUtils.js
 * 
 * What it Does:
 *   This file contains input related utilities for the game
 * 
 *   getCursorPosition: get the x and y position of a tap of click event on a canvas
 * 
 *   touchListDiffs: input a list of touches, get an object with dx and dy for the list
 *   helpful determining swipe direction
 * 
 *   diffSwipe: input an object containing dx and dy and get it back with an appended direction
 * 
 *   handleSwipe: input type of touch event, the touch event, and the function to run after the swipe
 *   returns a swipe in the form of { x, y, direction }
 * 
 *   doubleTapped: return a function that only runs if called twice within a delay
 * 
 * What to Change:
 *   Add any new methods that don't fit anywhere else
 *   eg. 
 * 
 */

// get cursor event position (tap, click, etc)
// needed for canvas click while top bar active
const canvasInputPosition = (canvas, event) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

// take touch list return a diffs for x and y
const touchListDiffs = (touchList) => {
    return touchList
    .map((touch, idx, arr) => {
        // collect diffs
        let prev = arr[idx - 1] || arr[0];
        return {
            x: touch.x,
            y: touch.y,
            dx: touch.x - prev.x,
            dy: touch.y - prev.y
        }
    })
    .reduce((sum, diff) => {
        // sum the diffs
        sum.dx += diff.dx;
        sum.dy += diff.dy;

        return sum;
    }, { dx: 0, dy: 0 });
}

// take diffs, return a swipe with a direction
const diffSwipe = (diff) => {
    return [diff]
    .map(diff => {
        return {
            x: Math.abs(diff.dx) > Math.abs(diff.dy),
            y: Math.abs(diff.dy) > Math.abs(diff.dx),
            dx: diff.dx,
            dy: diff.dy
        };
    })
    .map(swipe => {
        // get swipe direction
        if (swipe.x) {
            swipe.direction = swipe.dx > 0 ?
            'right' : 'left';
        }

        if (swipe.y) {
            swipe.direction = swipe.dy > 0 ?
            'down' : 'up';
        }

        return {
            dx: swipe.dx,
            dy: swipe.dy,
            direction: swipe.direction
        };
    })
    .reduce(s => s);
}

let touches = [];
const onSwipe = (type, touch, length, fn) => {
    // reject non touch types
    if (!type.match(/touchstart|touchmove|touchend/)) {
        return;
    }

    // clear touch list
    if (type === 'touchstart') {
        touches = [];
    }

    // add to touch list
    if (type === 'touchmove') {
        let { clientX, clientY } = touch;
        touches.push({ x: clientX, y: clientY });
    }

    // get user intention
    if (type === 'touchend' && touches.length > length) {

        // convert: touches -> diffs -> swipe
        const swipe = [touches]
        .map(touches => touchListDiffs(touches))
        .map(diff => diffSwipe(diff))
        .reduce(s => s);

        fn(swipe);
    }
}

const doubleTapped = (delay, fn) => {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if ((now - lastCall < delay) && (now - lastCall > 0)) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

export {
    canvasInputPosition,
    onSwipe,
    doubleTapped
};