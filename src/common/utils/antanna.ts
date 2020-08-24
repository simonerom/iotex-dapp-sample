import Antenna from "iotex-antenna";
import { WsSignerPlugin } from "./ws-plugin";
import { utils } from "./index";
import { publicConfig } from "../../../configs/public";
import { JsBridgeSignerMobile } from "./js-plugin";
import { IRequest } from "iotex-antenna/lib/plugin/ws/request";
import sleepPromise from "sleep-promise";
import { Contract } from "iotex-antenna/lib/contract/contract";

export class AntennaUtils {
  public static defaultContractOptions = {
    gasLimit: "20000000",
    gasPrice: "1000000000000",
  };
  public static antenna: Antenna | null = null;

  public static wsSigner: WsSignerPlugin = new WsSignerPlugin({
    options: {
      packMessage: (data) => JSON.stringify(data),
      //@ts-ignore
      unpackMessage: (data) => JSON.parse(data),
      attachRequestId: (data, requestId) => Object.assign({ reqId: requestId }, data),
      extractRequestId: (data) => data && data.reqId,
    },
  });

  static getAntenna(): Antenna {
    if (this.antenna) {
      return this.antenna;
    }
    if (utils.env.isBrowser()) {
      const antenna = new Antenna(publicConfig.IOTEX_CORE_ENDPOPINT, {
        signer: this.wsSigner.start(),
      });
      //@ts-ignore
      this.antenna = antenna;
      return antenna;
    }

    if (globalThis.isIoPayMobile) {
      const antenna = new Antenna(publicConfig.IOTEX_CORE_ENDPOPINT, {
        signer: new JsBridgeSignerMobile(),
      });
      //@ts-ignore
      this.antenna = antenna;
      return antenna;
    }

    if (utils.env.isSSR()) {
      const antenna = new Antenna(publicConfig.IOTEX_CORE_ENDPOPINT);
      //@ts-ignore
      this.antenna = antenna;
      return antenna;
    }
  }
}
const contractsByAddrs: Record<string, Contract> = {};

// tslint:disable-next-line:no-any
export function lazyGetContract(address: string, abi: any): Contract {
  if (contractsByAddrs[address]) {
    return contractsByAddrs[address];
  }
  const antenna = AntennaUtils.getAntenna();
  contractsByAddrs[address] = new Contract(abi, address, {
    provider: antenna.iotx,
    signer: antenna.iotx.signer,
  });
  return contractsByAddrs[address];
}

// tslint:disable-next-line:insecure-random
let reqId = Math.round(Math.random() * 10000);
let ioPayAddress: string;

async function getIoAddressFromIoPay(): Promise<string> {
  if (ioPayAddress) {
    return ioPayAddress;
  }
  window.console.log("getIoAddressFromIoPay start");
  const id = reqId++;
  const req: IRequest = {
    reqId: id,
    type: "GET_ACCOUNTS",
  };
  let sec = 1;
  // @ts-ignore
  while (!window.WebViewJavascriptBridge) {
    window.console.log("getIoAddressFromIoPay get_account sleepPromise sec: ", sec);
    await sleepPromise(sec * 200);
    sec = sec * 1.6;
    if (sec >= 48) {
      sec = 48;
    }
  }
  return new Promise<string>((resolve) =>
    // @ts-ignore
    window.WebViewJavascriptBridge.callHandler("get_account", JSON.stringify(req), (responseData: string) => {
      window.console.log("getIoAddressFromIoPay get_account responseData: ", responseData);
      let resp = { reqId: -1, address: "" };
      try {
        resp = JSON.parse(responseData);
      } catch (_) {
        return;
      }
      if (resp.reqId === id) {
        resolve(resp.address);
        ioPayAddress = resp.address;
      }
    })
  );
}

export async function getIotxBalance(address: string): Promise<number> {
  const antenna = AntennaUtils.getAntenna();
  const { accountMeta } = await antenna.iotx.getAccount({ address });
  // @ts-ignore
  return Number(fromRau(accountMeta.balance, "Iotx"));
}

export async function signMessage(message: string): Promise<string> {
  const antenna = AntennaUtils.getAntenna();
  if (antenna.iotx.signer && antenna.iotx.signer.signMessage) {
    const signed = await antenna.iotx.signer.signMessage(message);
    if (typeof signed === "object") {
      return Buffer.from(signed).toString("hex");
    }
    return signed;
  }
  const account = antenna.iotx.accounts[0];
  const sig = account && (await account.sign(message));
  return (sig && sig.toString("hex")) || "";
}
