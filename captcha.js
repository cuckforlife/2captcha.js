const axios = require('axios');

const delay = (t, val) => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(val);
    }, t);
  });
};

async function solveCaptcha(base64, config) {
  console.log('solving captcha...');

  const URL_IN = 'https://2captcha.com/in.php';
  const METHOD = 'base64';
  const URL_RES = 'https://2captcha.com/res.php';
  const ACTION = 'get';

  return await axios
    .post(URL_IN, {
      method: METHOD,
      key: config.KEY,
      body: base64,
      json: 1,
    })
    .then(async function(response) {
      console.log(`step 1 : ${JSON.stringify(response.data)}`);
      if (response.data.status !== 1) {
        throw new Error(
          'error inRequest response : ' + JSON.stringify(response.data)
        );
      }

      let id = response.data.request;
      const resRequest = `${URL_RES}?key=${config.KEY}&id=${id}&action=${ACTION}&json=1`;

      const IN_TIMEOUT = 20 * 1000;
      return await loopForReply(resRequest, IN_TIMEOUT);
    });
}

async function loopForReply(resRequest, timeout) {
  await delay(timeout);
  const IN_TIMEOUT_NEXT = 5 * 1000;

  return await axios.get(resRequest).then(async response => {
    console.log(`step 2 : ${JSON.stringify(response.data)}`);
    if (
      response.data.status !== 1 &&
      response.data.request === 'CAPCHA_NOT_READY'
    ) {
      return await loopForReply(resRequest, IN_TIMEOUT_NEXT);
    } else if (response.data.status !== 1) {
      throw new Error(
        'error resRequest response : ' + JSON.stringify(response.data)
      );
    } else {
      return response.data.request;
    }
  });
}

module.exports = {
  solveCaptcha,
};
