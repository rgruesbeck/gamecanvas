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

    let image = 'http://takizawa.gr.jp/uk9o-tkzw/tv/tvptnotv.jpg';
    broadcast({ scope: scope, key: key, value: image });
}

const testSound = ({ scope, key, value }) => {
    // let sound = 'https://ia600504.us.archive.org/0/items/HunsuckerPodcastSoundEffects/Mr.Burns-Excellent.mp3';
    // let sound = 'https://ia802901.us.archive.org/14/items/cd_light-as-a-feather_chick-corea-and-return-to-forever/disc1%2F04.%20Chick%20Corea%20and%20Return%20to%20Forever%20-%20500%20Miles%20High_sample.mp3';
    let sound = 'https://ia800304.us.archive.org/25/items/ird059/tcp_d3_02_iran_iraq_jamming_efficacy_testting_irdial.mp3';
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