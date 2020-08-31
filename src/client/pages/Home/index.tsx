import React, { useEffect } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import "./index.scss";
import { useStore } from "../../../common/store/index";
import { ClientOnly } from "../../components/ClientOnly/clientOnly";
import { rpcClient } from "../../utils/rpc";
import { Button, Menu } from "antd";
import { publicConfig } from "../../../../configs/public";

export const Home = () => {
  const { lang, wallet } = useStore();
  const store = useLocalStore(() => ({
    count: 0,
    setCount(count) {
      this.count = count;
    },
    onConnectWallet() {
      wallet.autoConnect = true;
      wallet.initWS();
      window.location.replace("iopay://");
      setTimeout(() => {
        window.location.replace(location.href);
      }, 60000);
    },
  }));
  useEffect(() => {
    wallet.init();
    rpcClient.login("test", "123").then(async () => {
      const me = await rpcClient.me();
      console.log({ me });
      await rpcClient.logout();
      const logoutMe = await rpcClient.me();
      console.log({ me: logoutMe });
    });
  }, []);
  return useObserver(() => (
    <div className="home w-full">
      {!wallet.account.address ? (
        <button onClick={store.onConnectWallet}>Connect to wallet...</button>
      ) : (
        <div>
          <Button className="px-2 mx-2" onClick={() => wallet.claimVita()}>
            Claim VITA
          </Button>
          <Button className="px-2 mx-2" onClick={() => wallet.transferVita()}>
            Transfer 1 VITA
          </Button>
          <Button className="px-2 mx-2" onClick={() => wallet.transferIotx()}>
            Transfer 1 IOTX
          </Button>
          {wallet.actionHash && (
            <p>
              Action Hash: <a href={`${publicConfig.IOTEXSCAN_ENDPOINT}/action/${wallet.actionHash}`}>{wallet.actionHash}</a>
            </p>
          )}
        </div>
      )}
    </div>
  ));
};
