import { ModalProps } from "antd/lib/modal";

const tradeOfferModalDefaultProps: ModalProps = {
  bodyStyle: { minHeight: "90vh", maxHeight: "90vh" },
  okButtonProps: { style: { visibility: "hidden" } },
  cancelButtonProps: { style: { visibility: "hidden" } },
  maskTransitionName: "none",
  transitionName: "none",
  width: "90%",
  className: "centered",
};

export default tradeOfferModalDefaultProps;
