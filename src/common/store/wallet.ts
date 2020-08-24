import { observable, action, computed } from "mobx";
import remotedev from "mobx-remotedev";
import { AntennaUtils } from "../utils/antanna";
import { utils } from "../utils/index";
import { fromRau } from "iotex-antenna/lib/account/utils";

@remotedev({ name: "wallet" })
export class WalletStore {
  @observable account = {
    address: "",
    balance: "",
  };
  @observable enableConnect = false;
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
    if (globalThis.isIoPayMobile) {
    } else {
      const [err, accounts] = await utils.helper.promise.runAsync(AntennaUtils.wsSigner.getAccounts());
      if (err || !accounts.length) {
        if (this.enableConnect) {
          setTimeout(() => {
            this.initWS();
          }, 5000);
        }
        return;
      }
      this.account.address = accounts[0].address;
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
}
