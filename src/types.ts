import { BigNumber } from "ethers"

export type ERC20Config = {
    /// Name as defined by Open Zeppelin ERC20.
    name : string,
    /// Symbol as defined by Open Zeppelin ERC20.
    symbol : string,
    /// Distributor address of the initial supply.
    /// MAY be zero.
    distributor : string,
    /// Initial supply to mint.
    /// MAY be zero.
    initialSupply : BigNumber
}

export type SaleConfig = {
    vmStateConfig : any,
    recipient : string,
    reserve : string,
    startBlock : number,
    cooldownDuration : number,
    saleTimeout : number,
    minimumRaise : BigNumber,
    dustSize : number,
}

export type SaleRedeemableERC20Config = {
    erc20Config : ERC20Config,
    tier : string,
    minimumTier : Tier
}

export enum Tier {
    ZERO,
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
  }