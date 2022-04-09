import fs from 'fs'
import * as path from 'path'

export const writeJsonToFile = (_path: string, json: any): void => {
  fs.writeFileSync(_path, JSON.stringify(json, null, '    '))
}

export const getDeployedPath = (_network: string, _branch: string): string =>
  path.join(
    __dirname,
    '..',
    '..',
    '..',
    'node_modules',
    '@devotrixinc',
    'crastonic-smartcontract',
    'deployments',
    _network,
    _branch,
    'deploy.json'
  )

export const getPricingABI = () => {
    const pricingAbi = require('@devotrixinc/crastonic-smartcontract/abi/Pricing.json');
    return pricingAbi
}