import { Request, ResponseToolkit, ResponseObject, ServerRoute } from "@hapi/hapi";
import { attestingFlow } from '../../../attester/attestClaim'
import { asyncReadFile } from '../../../Util/asyncReadWriteFile';

async function attest(request: Request, h: ResponseToolkit): Promise<ResponseObject>{
    let receive:any = request.payload
    if (receive.Attest === 'true'){
      //console.log('do smth')
      let creds = JSON.parse(receive.Cred2Attest) 
      await attestingFlow(creds,receive.AttesterMnemonic,receive.AttesterDID)
      .catch((e) => {
        console.log('Error while going throw attesting workflow', e)
      })
      .then((c) => {
        console.log('⚠️  attested creds is stored in ../temp/claimerCreds.txt ⚠️')
      })
    }else{
      console.log('by right, we should delete, but... demo purposes we keep')
    }
    return h.redirect('/service')
}

export const attesters: ServerRoute[] = [
      {
        method: "POST",
        path: "/attest",
        handler: attest,
        options: {
          auth: {
            mode: 'try'
          }
        }
      }   
];