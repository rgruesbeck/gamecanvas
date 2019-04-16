const WebFont = require('webfontloader');

const loadList = (list) => {
  return Promise.all(list)
  .then((assets) => {
    return assets.reduce((collection, asset) => {
      // separate assets by type
      // add them to the collection

      const { type, key, value } = asset;

      const collectionIncludes = Object.keys(collection).includes(type);
      if (!collectionIncludes) { collection[type] = {} }

      collection[type][key] = value;
      return collection;
    }, {});
  })
}

const loadImage = (key, url) => {
  let result = { type: 'image', key: key, value: null };

  // check
  if (!key || !url) { return result; }

  return new Promise((resolve, reject) => {
    let image = new Image;
    image.src = url;

    // loaded
    image.onload = () => {
      resolve({...result, ...{ value: image }});
    };

    // error
    image.onerror = () => {
      reject(result);
    };
  });

}

const loadSound = (key, url) => {
  let result = { type: 'sound', key: key, value: null };

  // check
  if (!key || !url) { return result; }

  return new Promise((resolve, reject) => {
    let sound = new Audio(url);

    // loaded
    sound.oncanplaythrough = () => {
      resolve({...result, ...{ value: sound }});
    };

    // error
    sound.onerror = () => {
      reject(result);
    };
  });
}

const loadFont = (key, fontName) => {
  let result = { type: 'font', key: key, value: null };

  // check
  if (!key || !fontName) { return result; }

  return new Promise((resolve, reject) => {
    const font = {
      google: {
        families: [fontName]
      },
      fontactive: function (familyName) {
        console.log(familyName)
        resolve({...result, ...{ value: familyName }});
      }
    }
    WebFont.load(font);
  });
}

export { loadList, loadImage, loadSound, loadFont };