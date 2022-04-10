export enum TxStatus {
  Pending = 'pending', // In the txpool or to be resent to pool (dropped or underpriced)
  Underpriced = 'underpriced', // Not accepted into tx pool at current price
  Failure = 'failure', // Mined and failed
  Mined = 'mined', // Only mined - status unknown
  Replaced = 'replaced', // Replaced by a transaction with a higher gasPrice
}
enum TxErrorReasons {
  OutOfGas = 'out of gas',
}
