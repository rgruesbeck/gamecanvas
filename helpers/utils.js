const getSmoother(width, height, frameRate) {
    // smooth out character movement
    // for different screen sizes and browser frame rates

    let scale = (width + height) / 2;
    return (scale * frameRate) / 10000;
}

export { getSmoother };