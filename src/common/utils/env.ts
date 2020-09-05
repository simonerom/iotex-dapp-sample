import { utils } from "./index";
export class Env {
  isSSR() {
    return typeof window === "undefined";
  }
  onSSR(func) {
    if (this.isSSR()) {
      func();
    }
  }
  isBrowser() {
    return typeof window === "object";
  }
  onBrowser(func) {
    if (this.isBrowser()) {
      func();
    }
  }
  getEnv() {
    if (this.isBrowser()) {
      //@ts-ignore
      return window.__ROOT__STORE__.base;
    }
    if (this.isSSR()) {
      return process.env;
    }
  }
  isIoPayMobile() {
    if (utils.env.isSSR()) return false;
    return navigator.userAgent && (navigator.userAgent.includes("IoPayAndroid") || navigator.userAgent.includes("IoPayiOs"));
  }
  getBoolean(val: string | boolean) {
    if (typeof val == "string") {
      return val == "true";
    } else if (typeof val == "boolean") {
      return val;
    }
    return false;
  }
}
