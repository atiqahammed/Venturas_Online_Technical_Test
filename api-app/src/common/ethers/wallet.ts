import { ethers, providers } from 'ethers'
require('dotenv').config();

const NETWORK = process.env.NETWORK || 'ganache'
const INFURA_KEY = process.env.INFURA_KEY || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL || ''
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || ''

const URL = () => {
    if (NETWORK === 'rinkeby') return `https://rinkeby.infura.io/v3/${INFURA_KEY}`
    if (NETWORK === 'mumbai') return `${MUMBAI_RPC_URL}`
    if (NETWORK === 'polygon') return `${POLYGON_RPC_URL}`
    return 'http://localhost:7545'
}

export const provider = new providers.JsonRpcProvider(URL())
  
export const createWalletFromPK = () => {
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    return wallet
}
  
export const getWallet = () => {
    return createWalletFromPK()
}