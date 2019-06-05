/**
 * game/utils/imageUtils.js
 * 
 * What it Does:
 *   This file contains image related utilities for the game
 * 
 *   resizeByWidth: get resized dimensions by width
 * 
 *   resizeByHeight: get resized dimensions by height
 * 
 *   resize: input image and width or height and get resized dimensions
 * 
 * What to Change:
 *   Add any new methods that don't fit anywhere else
 *   eg. 
 * 
 */

// resize image by width
const resizeByWidth = (width, naturalWidth, naturalHeight) => {
    // cross multiply to get new height
    return {
        width: parseInt(width),
        height: parseInt(width * naturalHeight / naturalWidth)
    };
};

// resize image by height
const resizeByHeight = (height, naturalWidth, naturalHeight) => {
    // cross multiply to get new width
    return {
        height: parseInt(height),
        width: parseInt(height * naturalWidth / naturalHeight)
    };
};

// resize wrapper
const resize = ({ image, width, height }) => {
    // image required
    if (!image) {
        console.error('resize requires an image');
        return;
    }

    // width or height required
    if (!width && !height) {
        console.error('resize requires a width or height');
        return;
    }

    // useless echo
    if (width && height) {
        return { width: width, height: height };
    }

    // set variables
    let naturalWidth = image.width;
    let naturalHeight = image.height;
    let result = {};

    // if width: resize by width
    if (width) {
        result = {
            ...result,
            ...resizeByWidth(width, naturalWidth, naturalHeight)
        }
    }

    // if height: resize by height
    if (height) {
        result = {
            ...result,
            ...resizeByHeight(height, naturalWidth, naturalHeight)
        }
    }

    return result;
};

export {
    resize
};