import { config as envConfig } from 'dotenv'

import * as Kilt from '@kiltprotocol/sdk-js'

import { createClaim } from './createClaim'
import { generateKeypairs } from './generateKeypairs'
import { getDriverLicenseSchema} from '../attester/ctypeSchema'

import { asyncWriteFile, asyncReadFile } from '../Util/asyncReadWriteFile'

// create and return a RequestForAttestation from claim
async function requestFromClaim(
  lightDid: Kilt.Did.LightDidDetails,
  keystore: Kilt.Did.DemoKeystore,
  claim: Kilt.IClaim
): Promise<Kilt.IRequestForAttestation> {
  const request = Kilt.RequestForAttestation.fromClaim(claim)
  await request.signWithDidKey(
    keystore,
    lightDid,
    lightDid.authenticationKey.id
  )
  return request
}

export async function generateRequest(
  claimAttributes: Kilt.IClaim['contents']
): Promise<Kilt.IRequestForAttestation> {
  // init
  await Kilt.init({ address: "wss://peregrine.kilt.io/parachain-public-ws" })

  const keystore = new Kilt.Did.DemoKeystore()

  // extracting first line of claim 
  let claims = await asyncReadFile('../temp/claims.txt')
  let claims_split = await claims.toString().split('\n')
  let firstLine:any = claims_split.shift()
  //let extracted_claims = claims_split.join('\n')
  //asyncWriteFile('../temp/claims.txt', extracted_claims, 'w') //clears ../temp/claims.txt 
  
  var lightdidobj = await JSON.parse(firstLine)
  const keys = await generateKeypairs(keystore, lightdidobj.CLAIMER_MNEMONIC)

  // create the DID
  const lightDid = Kilt.Did.LightDidDetails.fromDetails({
    ...keys,
    authenticationKey: {
      publicKey: keys.authenticationKey.publicKey,
      type: Kilt.VerificationKeyType.Sr25519
    }
  })

  // create claim
  const ctype = getDriverLicenseSchema()
  const claim = await createClaim(lightDid, ctype, claimAttributes)

  // create request
  console.log('claimer -> create request')
  return await requestFromClaim(lightDid, keystore, claim)
}




