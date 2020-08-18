export const helper = {
  promise: {
    async sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async runAsync<T, U = Error>(promise: Promise<T>): Promise<[U | null, T | null]> {
      return promise
        .then<[null, T]>((data: T) => [null, data])
        .catch<[U, null]>((err) => [err, null]);
    },
  },
  string: {
    truncate(fullStr = "", strLen, separator = "") {
      if (fullStr.length <= strLen) return fullStr;

      separator = separator || "...";

      const sepLen = separator.length;
      const charsToShow = strLen - sepLen;
      const frontChars = Math.ceil(charsToShow / 2);
      const backChars = Math.floor(charsToShow / 2);

      return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
    },
  },
};
