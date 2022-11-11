import * as Kilt from '@kiltprotocol/sdk-js'
import { generateKeypairs } from '../Util/generateKeypairs'
import { generateAccount, getAccount } from '../Util/generateAccount'
import * as envConfig from 'dotenv'
import { writeEnvVar, appendEnvVar} from "../Util/genDotEnv";

export async function createFullDid(): Promise<Kilt.Did.FullDidDetails> {
  await Kilt.init({ address: process.env.WSS_ADDRESS })
  const { api } = await Kilt.connect()
  const mnemonic = process.env.SERVER_MNEMONIC as string

  // Init keystore and load attester account
  const account = await getAccount(mnemonic)
  const keystore = new Kilt.Did.DemoKeystore()

  // generate the keypairs
  // we are using the same mnemonic as for the attester account, but we could also use a new secret
  const keys = await generateKeypairs(keystore, mnemonic)

  // get extrinsic that will create the DID on chain and DID-URI that can be used to resolve the DID Document
  return new Kilt.Did.FullDidCreationBuilder(api, keys.authentication)
    .addEncryptionKey(keys.keyAgreement)
    .setAttestationKey(keys.assertionMethod)
    .setDelegationKey(keys.capabilityDelegation)
    .buildAndSubmit(keystore, account.address, async (creationTx) => {
      await Kilt.BlockchainUtils.signAndSubmitTx(creationTx, account, {
        resolveOn: Kilt.BlockchainUtils.IS_FINALIZED
      })
    })
}

export async function getFullDid(
  didUri: Kilt.DidUri
): Promise<Kilt.Did.FullDidDetails> {
  // make sure the did is already on chain
  const onChain = await Kilt.Did.FullDidDetails.fromChainInfo(didUri)
  if (!onChain) throw Error(`failed to find on chain did: ${didUri}`)
  return onChain
}

if (require.main === module){
  const directory = `${process.cwd()}/Account-assets/.env`

generateAccount()
   .catch((e) => {
     console.log('Error while setting up Server account', e)
     process.exit(1)
   })
   .then(({ mnemonic, account }) => {
     console.log(`Building Environment Variable...\n`)

     let envvar = ''
     envvar += `WSS_ADDRESS = "wss://peregrine.kilt.io/parachain-public-ws"\n`
     envvar += `SERVER_MNEMONIC="${mnemonic}"\n`
     envvar += `SERVER_ADDRESS=${account.address}\n`
     writeEnvVar(envvar) 
     console.log(`.env file is in ${directory}\n`)
     console.log(`Get coins from https://faucet.peregrine.kilt.io?${account.address}\n\n`)
     envConfig.config({path: directory})

     setTimeout(() => {
      createFullDid().catch((e)=>{
        console.log('Error while creating DID',e)
        process.exit(1)
      }).then((did)=>{
       appendEnvVar(`SERVER_DID_URI=${did.uri}\n`)
       process.exit(1)
      })
     }, 60000);
    })
}
