import { observable, action, computed } from "mobx";
import remotedev from "mobx-remotedev";
import { AntennaUtils } from "../utils/antanna";
import { utils } from "../utils/index";
import { fromRau, toRau } from "iotex-antenna/lib/account/utils";
import { CLAIM_ABI } from "../constants/abi";
import { Contract } from "iotex-antenna/lib/contract/contract";
import BigNumber from "bignumber.js";

@remotedev({ name: "wallet" })
export class WalletStore {
  @observable account = {
    address: "",
    balance: "",
  };
  @observable autoConnect = false;
  @observable actionHash = "";
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
        console.log("iopay-desktop disconnected.");
        this.account = { address: "", balance: "" };
      });
  }

  @action.bound
  async initWS() {
    AntennaUtils.getAntenna();
    const [err, accounts] = await utils.helper.promise.runAsync(AntennaUtils.getAccounts());
    if (err || accounts?.length == 0) {
      if (this.enableConnect) {
        setTimeout(() => {
          this.initWS();
        }, 5000);
      }
      return;
    }
    this.account.address = accounts[0].address;
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
      const contract = new Contract(CLAIM_ABI, "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw", {
        provider: AntennaUtils.antenna.iotx,
        signer: AntennaUtils.antenna.iotx.signer,
      });

      const actionHash = await contract.methods.claim({
        // @ts-ignore
        account: AntennaUtils.antenna.iotx.accounts[0],
        gasLimit: "300000",
        gasPrice: "1000000000000",
      });

      this.actionHash = actionHash;
    } catch (e) {
      window.console.log(`failed to claim vita: ${e}`);
    }
  }

  @action.bound
  async transferVita() {
    try {
      const contract = new Contract(CLAIM_ABI, "io1hp6y4eqr90j7tmul4w2wa8pm7wx462hq0mg4tw", {
        provider: AntennaUtils.antenna.iotx,
        signer: AntennaUtils.antenna.iotx.signer,
      });

      const decimals = await contract.methods.decimals({
        // @ts-ignore
        account: AntennaUtils.antenna.iotx.accounts[0],
        gasLimit: "300000",
        gasPrice: "1000000000000",
      });

      const tokenAmount = new BigNumber(1).multipliedBy(new BigNumber(`1e${decimals.toNumber()}`));

      const actionHash = await contract.methods.transfer(this.account.address, tokenAmount.toString(), {
        // @ts-ignore
        account: AntennaUtils.antenna.iotx.accounts[0],
        gasLimit: "300000",
        gasPrice: "1000000000000",
      });

      this.actionHash = actionHash;
    } catch (e) {
      window.console.log(`failed to transfer vita: ${e}`);
    }
  }

  @action.bound
  async transferIotx() {
    try {
      const actionHash = await AntennaUtils.antenna.iotx.sendTransfer({
        to: this.account.address,
        from: this.account.address,
        value: toRau("1", "Iotx"),
        gasLimit: "100000",
        gasPrice: toRau("1", "Qev"),
      });

      this.actionHash = actionHash;
    } catch (e) {
      window.console.log(`failed to transfer iotx: ${e}`);
    }
  }
}
