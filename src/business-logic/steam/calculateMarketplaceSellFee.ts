// Everything here is copied from steam and tweaked so it can be transpilled with typescript
function calculateAmountToSendForDesiredReceivedAmount(receivedAmount, publisherFee, walletInfo) {
  if (!walletInfo["wallet_fee"]) {
    return receivedAmount;
  }

  publisherFee = typeof publisherFee == "undefined" ? 0 : publisherFee;

  const nSteamFee = Math.floor(
    Math.max(receivedAmount * parseFloat(walletInfo["wallet_fee_percent"]), walletInfo["wallet_fee_minimum"]) +
      parseInt(walletInfo["wallet_fee_base"])
  );

  const nPublisherFee = Math.floor(publisherFee > 0 ? Math.max(receivedAmount * publisherFee, 1) : 0);
  const nAmountToSend = receivedAmount + nSteamFee + nPublisherFee;

  return {
    steam_fee: nSteamFee,
    publisher_fee: nPublisherFee,
    fees: nSteamFee + nPublisherFee,
    amount: parseInt(nAmountToSend),
  };
}
function calculateFeeAmount(amount, publisherFee, walletInfo) {
  if (!walletInfo["wallet_fee"]) return 0;

  publisherFee = typeof publisherFee == "undefined" ? 0 : publisherFee;

  // Since CalculateFeeAmount has a Math.floor, we could be off a cent or two. Let's check:
  let iterations = 0; // shouldn't be needed, but included to be sure nothing unforseen causes us to get stuck
  let nEstimatedAmountOfWalletFundsReceivedByOtherParty =
    (amount - parseInt(walletInfo["wallet_fee_base"])) / (parseFloat(walletInfo["wallet_fee_percent"]) + parseFloat(publisherFee) + 1);

  let bEverUndershot = false;
  let fees = calculateAmountToSendForDesiredReceivedAmount(nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee, walletInfo);
  while (fees.amount != amount && iterations < 10) {
    if (fees.amount > amount) {
      if (bEverUndershot) {
        fees = calculateAmountToSendForDesiredReceivedAmount(nEstimatedAmountOfWalletFundsReceivedByOtherParty - 1, publisherFee, walletInfo);
        fees.steam_fee += amount - fees.amount;
        fees.fees += amount - fees.amount;
        fees.amount = amount;
        break;
      } else {
        nEstimatedAmountOfWalletFundsReceivedByOtherParty--;
      }
    } else {
      bEverUndershot = true;
      nEstimatedAmountOfWalletFundsReceivedByOtherParty++;
    }

    fees = calculateAmountToSendForDesiredReceivedAmount(nEstimatedAmountOfWalletFundsReceivedByOtherParty, publisherFee, walletInfo);
    iterations++;
  }

  // fees.amount should equal the passed in amount

  return fees;
}

export default function applySteamMarketFees(price: number): number {
  price *= 100;

  const fees = calculateFeeAmount(price, rgWallet.wallet_publisher_fee_percent_default, rgWallet);

  return (price - fees.fees) / 100;
}

export function calculateApiPrice(price: number) {
  price *= 100;

  const fees = calculateFeeAmount(price, rgWallet.wallet_publisher_fee_percent_default, rgWallet);
  return price - fees.fees;
}

const rgWallet = {
  wallet_currency: 3,
  wallet_country: "BG",
  wallet_state: "",
  wallet_fee: "1",
  wallet_fee_minimum: "1",
  wallet_fee_percent: "0.05",
  wallet_publisher_fee_percent_default: "0.10",
  wallet_fee_base: "0",
  wallet_balance: "202",
  wallet_delayed_balance: "0",
  wallet_max_balance: "175000",
  wallet_trade_max_balance: "157500",
  success: true,
  rwgrsn: -2,
};

console.log(applySteamMarketFees(15));
