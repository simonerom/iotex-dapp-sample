# iotex-dapp-sample

This repo provides a boilerplate IoTeX Dapp, with examples to use the antenna SDK, connect to the ioPay wallet, show balance, send IOTX and send XRC20 tokens.

## How to Use

Install it and run:

```bash
$ cp .env.tmpl .env
$ npm install
$ npm run dev
```

## Plugins

### Iotex-Antenna

You can simple use the `AntennaUtils` in our example code:

```bash
https://github.com/iotexproject/iotex-dapp-sample/blob/master/src/common/utils/antanna.ts
```

There are two plugin for our different ioPay Wallet:

- For desktop:

```
https://github.com/iotexproject/iotex-dapp-sample/blob/master/src/common/utils/ws-plugin.ts
```

- For mobile:

```
https://github.com/iotexproject/iotex-dapp-sample/blob/master/src/common/utils/js-plugin.ts
```

## Deploy Your Instance on Heroku

<a href="https://heroku.com/deploy?template=https://github.com/iotexproject/iotex-dapp-sample">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

## Reference

nestjs: https://docs.nestjs.com/

mobx: https://mobx.js.org/README.html

tailwindcss: https://tailwindcss.com/docs/installation/

razzle: https://github.com/jaredpalmer/razzle

ReduxDevTools: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en

wildcard-api: https://github.com/reframejs/wildcard-api

iotex-antenna: https://docs.iotex.io/developer/sdk/install-antenna-js.html
