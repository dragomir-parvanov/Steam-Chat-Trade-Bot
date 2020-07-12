import { AxiosRequestConfig } from "axios";

import { hostConfig } from "./hostConfig";

export const minerAxiosDefaultConfig: AxiosRequestConfig = {
  params: {
    key: hostConfig
  }
};
