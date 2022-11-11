import { mnemonicGenerate } from '@polkadot/util-crypto'
import * as Kilt from '@kiltprotocol/sdk-js'
import { generateKeypairs } from './generateKeypairs'

import { asyncWriteFile } from '../Util/asyncReadWriteFile'

export async function generateLightDid(): Promise<{
  lightDid: Kilt.Did.LightDidDetails
  mnemonic: string
}> {
  // init
  await Kilt.init({ address: process.env.WSS_ADDRESS })

  // create secret and DID public keys
  const keystore = new Kilt.Did.DemoKeystore()
  const mnemonic = mnemonicGenerate()
  const keys = await generateKeypairs(keystore, mnemonic)

  // create the DID
  const lightDid = Kilt.Did.LightDidDetails.fromDetails({
    ...keys,
    authenticationKey: {
      publicKey: keys.authenticationKey.publicKey,
      type: Kilt.VerificationKeyType.Sr25519
    }
  })

  return {
    lightDid,
    mnemonic
  }
}


// don't execute if this is imported by another file
if (require.main === module) {
  const directory = `${process.cwd()}/Account-assets/.env`

  generateLightDid()
    .catch((e) => {
      console.log('Error while setting up claimer DID', e)
      process.exit(1)
    })
    .then(({ lightDid, mnemonic }) => {      
      var claim = {
        CLAIMER_MNEMONIC: mnemonic,
        CLAIMER_DID_URI: lightDid.uri,
        CITIZENSHIP: '',
        CITIZENID: '',
        NAME: '',
        ADDRESS: ''
       }

      var json = JSON.stringify(claim)
      asyncWriteFile('../Account-assets/claims.txt', `${json}\n`, 'a+')
    })
}