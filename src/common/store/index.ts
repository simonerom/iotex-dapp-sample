import { utils } from "../utils/index";
import { extendObservable } from "mobx";
import { useStaticRendering } from "mobx-react";
import React from "react";
import { BaseStore } from "./base";
import { LangStore } from "./lang";
import { WalletStore } from "./wallet";

if (utils.env.isSSR()) {
  useStaticRendering(true);
}

export const createRootStore = () => {
  return {
    base: new BaseStore(),
    lang: new LangStore(),
    wallet: new WalletStore(),
  };
};

export function getRootStore() {
  if (utils.env.isSSR()) {
    return createRootStore();
  }

  const rootStore = createRootStore();
  Object.keys(rootStore).forEach((key) => {
    //@ts-ignore
    rootStore[key] = extendObservable(rootStore[key], window.__ROOT__STORE__[key]);
  });
  return rootStore;
}
export const rootStore = getRootStore();

export const StoresContext = React.createContext(rootStore);

export const useStore = () => React.useContext(StoresContext);
