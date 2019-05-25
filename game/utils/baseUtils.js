/**
 * game/utils/baseUtils.js
 * 
 * What it Does:
 *   This file contains utilities for the game
 * 
 *   randomBetween: get a numbers a min and a max, optionally ask for an int
 * 
 *   bounded: apply a lower and upper bound to a number
 *   useful for add limits to AI character movements
 * 
 *   isBounded: check if number is within a min and max
 * 
 *   getCursorPosition: get cursor position on the canvas
 *   needed for when tob bar is active
 * 
 *   hexToRgbA: color converter for easier use of the alpha channel
 * 
 *   throttled: wraps a function so that it can't be called until the delay
 *   in milliseconds has gone by. useful for stopping unwanted side effects of button mashing.
 *   https://gph.is/1syA0yc
 * 
 * 
 * What to Change:
 *   Add any new methods that don't fit anywhere else
 *   eg. 
 * 
 */

// get random number between min and max
const randomBetween = (min, max, type) => {
    const rand = Math.random() * (max - min) + min;

    if (type && type === 'int') {
        return Math.round(rand);
    }

    return rand;
}

// apply a lower and upper bound to a number
const bounded = (n, min, max) => {
    return [n]
    .map(n => n < min ? min : n)
    .map(n => n > max ? max : n)
    .reduce(n => n);
}

// check if n is within bounds
const isBounded = (n, min, max) => {
    return n > min && n < max;
}

// color converter
const hexToRgbA = (hex, opacity) => {
    let h=hex.replace('#', '');
    h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

    for(let i=0; i<h.length; i++)
        h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);

    if (typeof opacity != 'undefined')  h.push(opacity);

    return 'rgba('+h.join(',')+')';
}

// create throttled function
// checkout: https://outline.com/nBajAS
const throttled = (delay, fn) => {
    let lastCall = 0;
    return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return fn(...args);
    }
}

// find an entity in the list
// useful for checking for collisions
const findInList = (entList, fn) => {
    return entList
        .find((ent) => {
            return fn(ent);
        }) ?
        true : false;
}

// find an entity in an object
// useful for checking for collisions
const findInObject = (entObject, fn) => {
    return Object.entries(entObject)
        .find((ent) => {
            return fn(ent);
        }) ?
        true : false;
}

// find an entity in an object or list
// wrapper for findInList and findInObject
const findIn = (entities, fn) => {

    // check against list
    if (Array.isArray(entities)) {
        return findInList(entities, fn);
    }

    // check against object
    if (Object.keys(entities) > 1) {
        return findInObject(entities, fn);
    }

    return false;
};

// toy hash for prefixes
// useful for prefexing localstorage keys
const hashCode = (str, base = 16) => {
    return [str.split("")
    .reduce(function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a
    }, 0)] // create simple hash from string
    .map(num => Math.abs(num)) // only positive numbers
    .map(num => num.toString(base)) // convert to base
    .reduce(h => h); // fold
};

export {
    bounded,
    isBounded,
    findIn,
    hexToRgbA,
    randomBetween,
    hashCode,
    throttled
};