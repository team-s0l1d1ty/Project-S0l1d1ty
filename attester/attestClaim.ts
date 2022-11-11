import * as envConfig from 'dotenv'
import * as Kilt from '@kiltprotocol/sdk-js'

import { generateKeypairs } from '../Util/generateKeypairs'
import { getAccount } from '../Util/generateAccount'
import { getFullDid } from '../Util/generateDid_Template'
import { asyncWriteFile } from '../Util/asyncReadWriteFile'

export async function attestClaim(
  request: Kilt.IRequestForAttestation,
  mnemonic: string,
  attesterDid: Kilt.DidUri
): Promise<Kilt.IAttestation> {
  // Init
  await Kilt.init({ address: "wss://peregrine.kilt.io/parachain-public-ws" })
  await Kilt.connect()

  // load account & DID
  const account = await getAccount(mnemonic)
  const keystore = new Kilt.Did.DemoKeystore()
  await generateKeypairs(keystore, mnemonic)
  const fullDid = await getFullDid(attesterDid)

  // build the attestation object
  const attestation = Kilt.Attestation.fromRequestAndDid(request, fullDid.uri)

  // form tx and authorized extrinsic
  const tx = await attestation.getStoreTx()
  const extrinsic = await fullDid.authorizeExtrinsic(
    tx,
    keystore,
    account.address
  )

  // write to chain
  console.log('Attester -> submit attestation...')
  await Kilt.BlockchainUtils.signAndSubmitTx(extrinsic, account, {
    resolveOn: Kilt.BlockchainUtils.IS_FINALIZED
  })

  return attestation
}

export async function attestingFlow(request:Kilt.IRequestForAttestation, mnemonic:string,attesterDid:Kilt.DidUri): Promise<Kilt.ICredential> {
  // the attester checks the attributes and issues an attestation
  const attestation = await attestClaim(request, mnemonic, attesterDid)

  // send the attestation back to the claimer 🕊

  // build the credential and return it
  const credential = Kilt.Credential.fromRequestAndAttestation(
    request,
    attestation
  )
  await asyncWriteFile('../temp/claimerCreds.txt', JSON.stringify(credential), 'w')
  return credential
}

