import * as envConfig from 'dotenv'
import * as Kilt from '@kiltprotocol/sdk-js'

import { generateKeypairs } from '../Util/generateKeypairs'
import { getAccount } from '../Util/generateAccount'
import { getFullDid } from '../Util/generateDid_Template'
import { 
  getDriverLicenseSchema, 
  getEmailSchema 
} 
  from './ctypeSchema'

export async function ensureStoredCtype(): Promise<Kilt.CType> {
  // Init
  await Kilt.init({ address: process.env.WSS_ADDRESS })
  const mnemonic = process.env.ATTESTER_MNEMONIC as string
  const did = process.env.ATTESTER_DID_URI as Kilt.DidUri

  // Load Account
  const account = await getAccount(mnemonic)

  // Load DID
  const keystore = new Kilt.Did.DemoKeystore()
  await generateKeypairs(keystore, mnemonic)
  const fullDid = await getFullDid(did)

  // get the CTYPE and see if it's stored, if yes return it
  // const ctype = getEmailSchema()
  const ctype = getDriverLicenseSchema()
  const isStored = await ctype.verifyStored()
  if (isStored) {
    console.log('Ctype already stored. Skipping creation')
    return ctype
  }
  console.log('Ctype not present. Creating it now...')

  // authorize the extrinsic
  const tx = await ctype.getStoreTx()
  const extrinsic = await fullDid.authorizeExtrinsic(
    tx,
    keystore,
    account.address
  )

  // write to chain then return ctype
  await Kilt.BlockchainUtils.signAndSubmitTx(extrinsic, account, {
    resolveOn: Kilt.BlockchainUtils.IS_FINALIZED
  })

  return ctype
}

// don't execute if this is imported by another file
if (require.main === module) {
  const directory = `${process.cwd()}/Account-assets/.env`
  envConfig.config({path: directory})
  ensureStoredCtype()
    .catch((e) => {
      console.log('Error while checking on chain ctype', e)
      process.exit(1)
    })
    .then(() => process.exit())
}