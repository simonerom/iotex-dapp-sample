import React from "react";
import "./index.scss";
import { useStore } from "../../../common/store";
import { Button } from "antd";
import { useLocalStore, useObserver } from "mobx-react-lite";
import { utils } from "../../../common/utils/index";

export const Header = () => {
  const { lang, wallet } = useStore();

  const store = useLocalStore(() => ({
    onMore() {},
    onSettings() {},
    onConnectWallet() {
      wallet.connectWallet();
    },
  }));
  return useObserver(() => (
    <div className="component__header h-10 sm:h-10 md:h-12 lg:h-16">
      <div className="component__header__content flex justify-between items-center m-auto py-2 sm:py-2 md:py-3 lg:py-3">
        <img alt="logo" className="component__header__content__logo" src={"/image/logo.png"} />
        <div className="component__header__content__right c-gray flex justify-between items-center text-lg">
          {wallet.account.address ? (
            <>
              <span>{parseFloat(wallet.account.balance).toFixed(2)} IOTX</span>&nbsp;
              <div className="cursor-pointer">{utils.helper.string.truncate(wallet.account.address, 12)}</div>
              &nbsp;&nbsp;
              <img src="/image/iotx.png" className="w-8" />
            </>
          ) : (
            <button className="component__header__content__right__wallet_connect" onClick={store.onConnectWallet}>
              {lang.t("header.connect_to_wallet")}
            </button>
          )}
          &nbsp;&nbsp;
          <Button
            className="component__header__content__right__icon_button"
            onClick={store.onMore}
            type="text"
            shape="circle"
            icon={<img src="/image/icon_more.png" className="outline-none cursor-pointer w-8" />}
          />
        </div>
      </div>
    </div>
  ));
};
