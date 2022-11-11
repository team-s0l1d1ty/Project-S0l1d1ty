import * as envConfig from 'dotenv'

import { Request, ResponseToolkit, ResponseObject, ServerRoute } from "@hapi/hapi";
import { revokeCredentialFlow } from '../../../attester/revokeAttestation'
import { asyncReadFile, makeTable } from '../../../Util/asyncReadWriteFile';


async function getRevoke(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  let response = await makeTable(
    '../temp/claimerCreds.txt',
    'Credentials'
    )
  let cookieValue = request.auth.credentials
  return h.view(
    'revoketemplate',{AttesterDID:cookieValue.DID,content:response}
    )
}

async function postRevoke(request: Request, h: ResponseToolkit): Promise<ResponseObject>{
  let receive:any = request.payload
  let response:string = ""
  await revokeCredentialFlow(
      receive.AttesterDID, 
      receive.AttesterMnemonic,
      receive.Cred2Revoke
  )
    .catch((err:Error) => {
      console.log('Error while building request for revoking attested creds', err)
      response += err.name 
    })
    .then((did_string) => {
      console.log(
        `⚠️ citizen credential for ${did_string} revoked  ⚠️\n\n`
      )
      response += `⚠️ citizen credential for ${did_string} revoked  ⚠️`
    })
  return h.view('revoketemplate',{content: response})
}

export const revokeCreds: ServerRoute[] = [
  {
    method: "GET",
    path: "/revoke",
    handler: getRevoke,
  },
  {
    method: "POST",
    path: "/revoke",
    handler: postRevoke,
  }
      
];