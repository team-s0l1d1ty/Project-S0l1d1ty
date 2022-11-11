import * as Kilt from '@kiltprotocol/sdk-js'

import { createPresentation } from '../../claimer/createPresentation'
import { generateKeypairs } from '../../claimer/generateKeypairs'

export function getChallenge(): string {
  return Kilt.Utils.UUID.generate()
}

// verifies validity, ownership & attestation
async function verifyPresentation(
  presentation: Kilt.ICredential,
  challenge: string
): Promise<boolean> {
  const credential = new Kilt.Credential(presentation)

  let isValid = await credential.verify({ challenge })
  const isRevoked = credential.attestation.revoked
  //check ctype
  const validCtype = '0x0c8da8f42b67fe28b1f32ff41d4f07545ba291b309e1f145931c3440ca457671'
  let ctype = credential.attestation.cTypeHash
  if (ctype != validCtype){isValid=false}

  return isValid && !isRevoked
}

export async function verificationFlow(CREDENTIAL:string, MNEMONIC:string):Promise<boolean> {
  await Kilt.init({ address: 'wss://peregrine.kilt.io/parachain-public-ws' })

  // Load credential and claimer DID
  const credential = JSON.parse(CREDENTIAL as string)
  const keystore = new Kilt.Did.DemoKeystore()
  const keys = await generateKeypairs(keystore, MNEMONIC)
  const lightDid = Kilt.Did.LightDidDetails.fromDetails({
    ...keys,
    authenticationKey: {
      publicKey: keys.authenticationKey.publicKey,
      type: Kilt.VerificationKeyType.Sr25519
    }
  })

  // Verifier sends a unique challenge to the claimer 🕊
  const challenge = getChallenge()

  // create a presentation and send it to the verifier 🕊
  const presentation = await createPresentation(
    credential,
    lightDid,
    keystore,
    challenge
  )

  // The verifier checks the presentation
  const isValid = await verifyPresentation(presentation, challenge)

  if (isValid) {
    console.log('Verification successful! You are allowed to enter the club 🎉')
    return true
  } else {
    console.log('Verification failed! 🚫')
    return false
  }
}
