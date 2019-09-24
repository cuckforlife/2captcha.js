const captcha = require('./captcha');

async function main() {
  const toSolve = 'enter the captcha here, faggot';
  const config = {
    KEY: 'enter the 2captcha api key cuckold',
  };

  let result = await captcha.solveCaptcha(toSolve, config);
  console.log(result);
}

main();
