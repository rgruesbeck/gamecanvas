const broadcast = ({ scope, key, value }) => {
    window.postMessage({
        action: 'injectGlobal',
        payload: { scope, key, value }
    }, "*")
}

const testText = ({scope, key, value}) => {
    // store a backup
    let backup = { scope: scope, key: key, value: value };

    // change out text
    // setInterval(broadcast({ scope: scope, key: key, value: 'koji' }), 1000);
    broadcast({ scope: scope, key: key, value: 'vcc-text' });
}

const testColor = ({ scope, key, value }) => {
    // random color: http://disq.us/p/1mvpsb4
    let color = `#${(Math.random()*(1<<24)|0).toString(16)}`;
    broadcast({ scope: scope, key: key, value: color });
}

const testImage = ({ scope, key, value }) => {
    // let image = Math.random().toString(32).slice(2, 7);
    // let imgur = `https://i.imgur.com/${image}.png`;

    // let ipfs = 'http://ipfs.pics/ipfs/Qmep61aZqJhhmSkhQHUSUme5RFbi8ZfccxXC1TyjKHcEig';

    let image = 'https://images.koji-cdn.com/template-assets/fec2dcbc-3a64-4ec5-8f14-a918fa33316a_1556334085992.png';
    broadcast({ scope: scope, key: key, value: image });
}

const testSound = ({ scope, key, value }) => {
    let sound = 'https://ia600504.us.archive.org/0/items/HunsuckerPodcastSoundEffects/Mr.Burns-Excellent.mp3';
    broadcast({ scope: scope, key: key, value: sound });
}

const testScope = (scope, values) => {
    scope.fields
    .forEach(field => {
        let { type, key } = field;

        // test text fields
        if (type && (type === 'text' || type === 'textarea')) {
            console.log('testing-text', key)
            testText({
                scope: scope.key,
                key: key,
                value: values[key]
            });
        }

        // test color fields
        if (type && type === 'color') {
            console.log('testing-color', key)
            testColor({
                scope: scope.key,
                key: key,
                value: values[key]
            });
        }

        // test image fields
        if (type && type === 'image') {
            console.log('testing-image', key)
            testImage({
                scope: scope.key,
                key: key,
                value: values[key]
            });
        }

        // test sound fields
        if (type && type === 'sound') {
            console.log('testing-sound', key)
            testSound({
                scope: scope.key,
                key: key,
                value: values[key]
            });
        }
    })
}

const testConfig = (config) => {
    if (!config || !config['@@editor']) {
        return console.error(`${config} not a valid config`);
    }

    window.testConfig = () => {
        // test configs
        config['@@editor']
        .forEach(scope => {
            testScope(scope, config[scope.key]);
        })
    }
};

export {
    testConfig
};