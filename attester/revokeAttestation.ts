import type { KeyringPair } from '@polkadot/keyring/types'
import { getFullDid } from '../attester/generateDid_Attester'
import { getAccount } from '../Util/generateAccount'
import { asyncWriteFile, asyncReadFile } from '../Util/asyncReadWriteFile'
import { generateKeypairs } from '../Util/generateKeypairs'

import * as Kilt from '@kiltprotocol/sdk-js'
import { Attestation } from '@kiltprotocol/sdk-js'


export async function revokeCredential(
  keystore: Kilt.Did.DemoKeystore,
  attesterDid: Kilt.Did.FullDidDetails,
  submitterAccount: KeyringPair,
  credential: Kilt.ICredential,
  shouldRemove = false,
  resolveOn: Kilt.SubscriptionPromise.ResultEvaluator = Kilt.BlockchainUtils
    .IS_FINALIZED
): Promise<string> {
  
  console.log(credential.attestation.claimHash)
  
  const tx = shouldRemove
    ? // If the attestation is to be removed, create a `remove` tx,
      // which revokes and removes the attestation in one go.
      await Attestation.getRemoveTx(credential.attestation.claimHash, 0).then((tx) =>
          attesterDid.authorizeExtrinsic(tx, keystore, submitterAccount.address))
      
    : // Otherwise, simply revoke the attestation but leave it on chain.
      // Hence, the storage is not cleared and the deposit not returned.
      await Attestation.getRevokeTx(credential.attestation.claimHash, 0).then((tx) =>
          attesterDid.authorizeExtrinsic(tx, keystore, submitterAccount.address))

  // Submit the right tx to the KILT blockchain.
  await Kilt.BlockchainUtils.signAndSubmitTx(tx, submitterAccount, {
    resolveOn
  })

  return credential.attestation.claimHash
}

export async function connectAndGetFullDID(did_string: string){
    await Kilt.init({ address: "wss://peregrine.kilt.io/parachain-public-ws" })
    await Kilt.connect()
    const did = did_string as Kilt.DidUri
    return await getFullDid(did)
}

export async function getCredential(){
    let creds = await asyncReadFile('../temp/claimerCreds.txt')
    return await JSON.parse(creds.toString()) 
}

export async function revokeCredentialFlow(did_string: string, did_mnemonic: string, cred_string:string){
    const keystore = new Kilt.Did.DemoKeystore()
    const fulldid = await connectAndGetFullDID(did_string)
    const KeyringPair = await getAccount(did_mnemonic)
    //const credential = await getCredential()
    const credential = JSON.parse(cred_string)
    await generateKeypairs(keystore, did_mnemonic)
    const claimhash = await revokeCredential(keystore, fulldid, KeyringPair, credential)

    return claimhash
}