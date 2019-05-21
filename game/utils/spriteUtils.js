/**
 * game/utils/spriteUtils.js
 * 
 * What it Does:
 *   This file contains utilities for sprites
 * 
 *   inBox: check if coordinate is in box
 * 
 *   getDistance: get the distance between to points with an x and y
 * 
 *   pickLocation: pick a random location within a bounding box
 * 
 *   pickLocationAwayFrom: pick a location a distance away from another point
 * 
 *   pickLocationAwayFromList: pick a location a distance away from a list of points
 * 
 *   collideDistance: detect a collision based on distance
 * 
 *   collisionsWith: check a list or object of entities against one entity for a collision
 * 
 * What to Change:
 *   Add any utility methods that could be used by a sprite
 *   eg. 
 * 
 */

import {
    randomBetween,
    isBounded,
    findIn
} from './baseUtils.js';

// check if hit is in box
const inBox = (x, y, box) => {
    // check x and y against box
    const inX = isBounded(x, box.left, box.right);
    const inY = isBounded(y, box.top, box.bottom);

    return inX && inY;
}

// distance between two points
const getDistance = (pointA, pointB) => {
    let vx = pointA.x - pointB.x;
    let vy = pointA.y - pointB.y;

    return Math.sqrt(vx * vx + vy * vy);
}

// get random point or screen
const pickLocation = (bounds) => {
    return {
        x: randomBetween(bounds.left, bounds.right),
        y: randomBetween(bounds.top, bounds.bottom)
    };
}

// pick new location for moles so they aren't crowded
// pick random location in bounds and distance from point
const pickLocationAwayFrom = (bounds, point, distance, depth = 0, maxDepth = 10) => {
    // limit depth
    if (depth > maxDepth) { return; }

    // get random point or screen
    const location = pickLocation(bounds);
    const locationDistance = getDistance(location, point); 

    // return location when location is distance 
    // away from point, else try a new location
    return locationDistance >= distance ?
    location :
    pickLocationAwayFrom(bounds, point, distance, depth + 1);
}

const pickLocationAwayFromList = (bounds, list, distance, depth = 0, maxDepth = 10) => {
    // limit depth
    if (depth > maxDepth) { return; }

    // return any location if list is empty
    if (list.length < 1) {
        return pickLocation(bounds);
    }

    // get location checked against first element
    const location = pickLocationAwayFrom(bounds, list[0], distance);

    // check if point has close neighbors in list
    const hasCloseNeighbor = list.find(point => {
        // return if less than distance
        let dist = getDistance(location, point);
        return dist < distance;
    });

    // return location without close neighbors
    // else try new location
    return hasCloseNeighbor ?
    pickLocationAwayFromList(bounds, list, distance, depth + 1) :
    location;
}

// detect collision based on distance
// between point a and b
const collideDistance = (a, b) => {
    let distance = getDistance(a, b);
    return distance < (a.radius + b.radius);
}

const detectDistanceCollisions = (entity, entities) => {
    return findIn(entities, (ent) => {
        return collideDistance(entity, ent);
    })
}


export {
    inBox,
    getDistance,
    pickLocation,
    pickLocationAwayFrom,
    pickLocationAwayFromList,
    collideDistance,
    detectDistanceCollisions
};