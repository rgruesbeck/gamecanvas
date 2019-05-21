# HTML5 Canvas Game Scaffold
![Game Artwork](https://i.imgur.com/jcBe9Ef.png)

A perfect template for new game makers.

# VCC's

- 🎮 Change the text and game settings
    * [Open configuration](#~/.koji/customization/settings.json!visual)
- 🖼️ Replace the player, background and more
    * [Open configuration](#~/.koji/customization/images.json!visual)
- 🔈 Change the sounds and background music.
    * [Open configuration](#~/.koji/customization/sounds.json!visual)
- 💅 Change the colors and visual style
    * [Open configuration](#~/.koji/customization/colors.json!visual)
- ⚙️ Add your Google Analytics ID and Open Graph information for sharing
    * [Open configuration](#~/.koji/customization/metadata.json!visual)

## Structure
### ~/game/
This directory holds the game code.
- [game/main.js](#~/game/main.js) is where the load, create, and play loop are setup.
- [game/overlay.js](#~/game/overlay.js) controls the html overlay for displaying game text.

### ~/game/characters
This directory contains code for the game characters.
- [Player: game/characters/player.js](#~/game/characters/player.js)

### ~/game/objects
This directory contains code base classes like image, sprite, etc.
- [Image: game/objects/image.js](#~/game/objects/image.js)
- [Sprite: game/objects/sprite.js](#~/game/objects/sprite.js)

### ~/game/helpers
This directory contains helper code for loading assets and and requesting frames.
- [assetLoaders: game/helpers/assetLoaders.js](#~/game/helpers/assetLoaders.js)
- [animationFrame: game/helpers/sprite.js](#~/game/helpers/animationFrame.js)

### ~/game/utils
This directory contains utility code for common functions.
- [baseUtils: game/utils/baseUtils.js](#~/game/utils/baseUtils.js)
- [spriteUtils: game/utils/spriteUtils.js](#~/game/utils/spriteUtils.js)
- [gridUtils: game/utils/spriteUtils.js](#~/game/utils/gridUtils.js)

## Support
### Community
If you need any help, you can ask the community by [making a post](https://gokoji.com/posts), or [joining the discord](https://discordapp.com/invite/eQuMJF6).

### Helpful Resources
- [Mozilla Game Development Docs](https://developer.mozilla.org/en-US/docs/Games).
- [HTML5 Game Devs Forum](http://www.html5gamedevs.com/).