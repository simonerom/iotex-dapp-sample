import React, { useEffect } from "react";
import { useObserver, useLocalStore } from "mobx-react-lite";
import "./index.scss";
import { useStore } from "../../../common/store/index";
import { ClientOnly } from "../../components/ClientOnly/clientOnly";
import { rpcClient } from "../../utils/rpc";
import { Button } from "antd";

export const Home = () => {
  const { lang, wallet } = useStore();
  const store = useLocalStore(() => ({
    count: 0,
    setCount(count) {
      this.count = count;
    },
    onConnectWallet() {
      wallet.enableConnect = true;
      wallet.initWS();
      window.location.replace("iopay://");
      setTimeout(() => {
        window.location.replace(location.href);
      }, 5000);
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
    <ClientOnly>
      <div className="home">
        <div>
          {lang.t("HELLO_MESSAGE", { message: "React" })}: {store.count}
        </div>
        <Button className="px-2" onClick={() => store.setCount(store.count + 1)}>
          +
        </Button>
        <Button className="px-2" onClick={() => store.setCount(store.count - 1)}>
          -
        </Button>
        <div>
          <Button className="px-2" onClick={() => lang.setLang("en")}>
            en
          </Button>
          <Button className="px-2" onClick={() => lang.setLang("zh")}>
            zh
          </Button>
        </div>
        <div>
          {!wallet.account.address ? (
            <button onClick={store.onConnectWallet}>Connect to wallet...</button>
          ) : (
            <div>
              <p>
                {wallet.account.address}: {wallet.account.balance}
              </p>
              <Button className="px-2" onClick={() => wallet.claimVita()}>
                Claim VITA
              </Button>
              <Button className="px-2" onClick={() => wallet.transferVita()}>
                Transfer 1 VITA
              </Button>
              <Button className="px-2" onClick={() => wallet.transferIotx()}>
                Transfer 1 IOTX
              </Button>
              <p>{wallet.actionHash}</p>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  ));
};
