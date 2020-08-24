import { observable, action, computed } from "mobx";
import remotedev from "mobx-remotedev";
import { AntennaUtils, getIoPayAddress } from "../utils/antanna";
import { utils } from "../utils/index";
import { fromRau } from "iotex-antenna/lib/account/utils";
import { CLAIM_ABI } from "../../client/utils/abi";
import { Contract } from "iotex-antenna/lib/contract/contract";
import { log } from "util";

@remotedev({ name: "wallet" })
export class WalletStore {
  @observable account = {
    address: "",
    balance: "",
  };
  @observable enableConnect = false;
  @observable actionHash = "";

  @action.bound
  async init() {
    this.initEvent();
    await this.initWS();
    await this.loadAccount();
  }

  // async reset() {
  //   utils.eventBus.removeAllListeners("client.iopay.close").removeAllListeners("client.iopay.connected");
  // }

  initEvent() {
    utils.eventBus
      .on("client.iopay.connected", () => {
        console.log("iopay-desktop connected.");
      })
      .on("client.iopay.close", () => {
        this.account = { address: "", balance: "" };
      });
  }

  @action.bound
  async initWS() {
    const data = await getIoPayAddress();
    window.console.log(data);
    this.account.address = data;
    if (this.enableConnect) {
      setTimeout(() => {
        this.initWS();
      }, 5000);
    }
  }

  @action.bound
  async loadAccount() {
    if (!this.account.address) return;
    const data = await AntennaUtils.getAntenna().iotx.getAccount({ address: this.account.address });
    if (data?.accountMeta) {
      const { balance } = data?.accountMeta;
      this.account.balance = fromRau(balance, "iotx");
    }
  }

  @action.bound
  async claimVita() {
    try {
      const contract = new Contract(CLAIM_ABI, "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw", { provider: AntennaUtils.antenna.iotx, signer: AntennaUtils.antenna.iotx.signer });

      const actionHash = await contract.methods.claimAs(
        this.account.address,
        Buffer.from("132b161020b0bf98a4e0db727acc55b1adf7f4da1a08b2859e84a6a51495246b7d6ba627fcafb9625bd87934a8219bd0aed6576b796b01a9a47505ef68ce6d991b", "hex"),
        "1",
        {
          // @ts-ignore
          account: AntennaUtils.antenna.iotx.accounts[0],
          gasLimit: "300000",
          gasPrice: "1000000000000",
        }
      );

      this.actionHash = actionHash;
    } catch (e) {
      window.console.log(`failed to claim vita: ${e}`);
    }
  }
}
