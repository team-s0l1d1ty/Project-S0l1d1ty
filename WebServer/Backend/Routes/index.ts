import { Request, ResponseToolkit, ResponseObject, ServerRoute } from "@hapi/hapi";

import {generateLightDid} from '../../../claimer/generateLightDid'
import {generateRequest} from '../../../claimer/generateRequest'
import { asyncWriteFile } from '../../../Util/asyncReadWriteFile'

async function claimer(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    return h.file('../Test_Frontend/claimer.html')
}

async function receiveClaim(request: Request, h: ResponseToolkit): Promise<ResponseObject>{
    let receive:any = request.payload

    generateLightDid()
    .catch((e) => {
      console.log('Error while setting up claimer DID', e)
      process.exit(1)
    })
    .then(({ lightDid, mnemonic }) => {
      var claim = {
        CLAIMER_MNEMONIC: mnemonic,
        CLAIMER_DID_URI: lightDid.uri
       }

      var json = JSON.stringify(claim)
      asyncWriteFile('../temp/claims.txt', `${json}\n`, 'a+')

      generateRequest({
        citizenship: receive.citizenship,
        citizenid: receive.citizenid,
        name: receive.name,
        address: receive.address
      })
        .catch((e) => {
          console.log('Error while building request for attestation', e)
        })
        .then((request) => {
          asyncWriteFile('../temp/requests.txt', `${JSON.stringify(request)}\n`, 'a+')
          console.log(
            '⚠️  written to /temp/requests.txt  ⚠️\n\n'
          )
        })
    })
    return h.redirect('/admin')
}

export const claimers: ServerRoute[] = [
  {
    method: "GET",
    path: "/",
    handler: claimer,
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: "POST",
    path: "/claim",
    handler: receiveClaim,
    options: {
      auth: {
        mode: 'try'
      }
    }
  }
];