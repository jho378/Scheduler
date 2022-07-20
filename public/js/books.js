const fetch = require('node-fetch')
const parseBookImg = async () => {
    const response = await fetch(src="https://ads.pubmatic.com/AdServer/js/user_sync.html?kdntuid=1&p=157369&gdpr=0&gdpr_consent=&us_privacy=1---");
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    console.log(url)
}

parseBookImg();