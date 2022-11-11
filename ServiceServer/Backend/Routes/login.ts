import { verificationFlow } from "../verify";
import { Request, ResponseToolkit, ResponseObject, ServerRoute } from "@hapi/hapi";

async function postLogin(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  let received:any = request.payload
  //console.log(received)
  
  // Load credential and claimer DID
  let mnemonic:string = received.mnemonic
  let credential:string = received.credential
  
  //run verification flow
  let verified: boolean = await verificationFlow(credential, mnemonic)
  
  if (verified){
    let credJSON = JSON.parse(credential)
    let DID = credJSON.request.claim.owner
    //console.log(DID)
    request.cookieAuth.set({lightDID:DID})
    let response = h.redirect('/success')
    return response
  }
  else{
    let response = h.redirect('/') 
    return response
  }
}

async function getLogin(request: Request, h: ResponseToolkit){
    return h.file('../Frontend/login.html')
}

async function successLogin(request: Request, h:ResponseToolkit){
  let cookieValue = request.auth.credentials
  //let user = cookieValue.lightDID 
  return h.view('success',{content:cookieValue.lightDID})
}

async function logout(request:Request, h:ResponseToolkit){
  request.cookieAuth.clear()
  return h.file('../Frontend/login.html')
}

export const login: ServerRoute[] = [
  {
    method: "POST",
    path: "/login",
    handler: postLogin,
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: "GET",
    path: "/",
    handler: getLogin,
    options: {
      auth: {
        mode: 'try'
      }
    }
  },
  {
    method: "GET",
    path: "/success",
    handler: successLogin,
  },
  {
    method: "GET",
    path: "/logout",
    handler: logout,
  }
];