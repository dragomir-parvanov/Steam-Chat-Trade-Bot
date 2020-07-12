import client_clientRouter from "../router/client_clientRouter";

type ImplementedBindRouterType<R = typeof client_clientRouter> = {
  [i in keyof R]: OmitThisParameter<R[i]>;
};

export default ImplementedBindRouterType;
