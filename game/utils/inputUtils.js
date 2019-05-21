/**
 * game/utils/inputUtils.js
 * 
 * What it Does:
 *   This file contains input related utilities for the game
 * 
 * What to Change:
 *   Add any new methods that don't fit anywhere else
 *   eg. 
 * 
 */

// take touchlist return a diffs for x and y
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
    }, {});
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
            swipe.direction = swipe.x > 0 ?
            'right' : 'left';
        }

        if (swipe.y) {
            swipe.direction = swipe.y > 0 ?
            'up' : 'down';
        }
    })
}

const handleSwipe = (type, touch, fn) => {
    let touches = [];

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
    if (type === 'touchend' && touches.length > 0) {

        // get diffs from touches
        let diff = touchListDiffs(touches);

        // get swipe from diff
        let swipe = diffSwipe(diff);
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
    handleSwipe,
    doubleTapped
};