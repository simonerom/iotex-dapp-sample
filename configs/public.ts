import { utils } from "../src/common/utils/index";
const { NODE_ENV, FORCE_HTTPS } = utils.env.getEnv();

const IS_PROD = NODE_ENV == "production";
export const publicConfig = {
  IS_PROD,
  IOTEX_CORE_ENDPOPINT: IS_PROD ? "https://api.iotex.one:443" : "https://api.testnet.iotex.one:443",
  IOTEXSCAN_ENDPOINT: IS_PROD ? "http://iotexscan.io" : "http://testnet.iotexscan.io",
  FORCE_HTTPS: utils.env.getBoolean(FORCE_HTTPS),
};
