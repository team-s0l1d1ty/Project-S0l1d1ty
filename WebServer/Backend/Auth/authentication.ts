import * as Kilt from '@kiltprotocol/sdk-js'

//function to get DID URL from Frontend


//functions to connect to chain and query chain
export async function init_connect(){
    await Kilt.init({ address: 'wss://peregrine.kilt.io/parachain-public-ws' })
    await Kilt.connect()
  }

export async function kiltDisconnect(){
    await Kilt.disconnect()    
}

export async function getFullDid(
    didUri: Kilt.DidUri
  ): Promise<Kilt.Did.FullDidDetails> {
    // make sure the did is already on chain
    const onChain = await Kilt.Did.FullDidDetails.fromChainInfo(didUri)
    if (!onChain) throw Error(`failed to find on chain did: ${didUri}`)
    return onChain
  }

//Check 
export async function verifyFullDidOnChain(didUri:Kilt.DidUri):Promise<Boolean>{
    init_connect()
    let isValid : Boolean = false
    await getFullDid(didUri).catch((e)=>{
        isValid = false
    })
    .then((onChain)=>{
        if(onChain != null){isValid = true}
    })
    kiltDisconnect()
    return isValid
}

//Test
if (require.main===module){
    const did = "did:kilt:4oP2VYorKoy5dVkRedqR2yvaDLeScXMEQom9NNWTaMm6inGP"
    const lightDid = "did:kilt:light:004sVz4AiwCd4LAB1FhF2XgSEc3Yp6F5HkbWrReUdGU9qrwaQe:z1Ac9CMtYCTRWjetJfJqJoV7FcPYrdRCgmbxbH73iUteavUbAyrBvbM9pNyLbFJ77H1msET8VN5uApyWRhvtHrQ"
    verifyFullDidOnChain(did).catch()
    .then(process.exit(1))
    
    /*init_connect()
    getFullDid(did).catch((e) => {
        //console.log('DID Does not exist!', e)
        console.log('DID does not exist!')
        process.exit(1)
      })
      .then((onChain)=>{
        console.log('true')
        process.exit(1)
      })*/
}