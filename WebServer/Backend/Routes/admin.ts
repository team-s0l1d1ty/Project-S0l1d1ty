import { Request, ResponseToolkit, ResponseObject, ServerRoute } from "@hapi/hapi";
import { DidUri } from "@kiltprotocol/sdk-js";

import { asyncReadFile, makeTable } from "../../../Util/asyncReadWriteFile";
import {verifyFullDidOnChain} from '../Auth/authentication'

async function postLogin(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
  //parse request
  let received:any = request.payload
  let DID: DidUri = received.DID
  //verify DID
  if (await verifyFullDidOnChain(DID) != false){
    //set cookie
    request.cookieAuth.set({DID: received.DID})
    let response = h.redirect('/dashboard')
    return response
  }
  else{
    return h.redirect('/admin')
  }
}
async function getLogin(request: Request, h: ResponseToolkit){
    let response = h.file('../Test_Frontend/admin.html')
    response.code(200)
    return response
}

async function getDashboard(request: Request, h: ResponseToolkit){
  let cookieValue = request.auth.credentials
  let tableReq = await makeTable(
    '../temp/requests.txt',
    'Claims'
    )
  let response = h.view('dashboardtemplate',
  {AttesterDID:cookieValue.DID,content:tableReq}
  )
  response.code(200)
  return response
}

async function getService(request: Request, h: ResponseToolkit){
  //let claimerCreds = await asyncReadFile('../temp/claimerCreds.txt')
  let claimerCreds = await makeTable(
    '../temp/claimerCreds.txt', 
    'Credentials'
    )
  let lightDid = await makeTable(
    '../temp/claims.txt',
    'light DID'
    )
  let cookieValue = request.auth.credentials
  return h.view(
    'retrievetemplate',
    {AttesterDID:cookieValue.DID,claims:lightDid,content:claimerCreds}
    )
}

export const adminPOST: ServerRoute[] = [
  {
    method: "POST",
    path: "/admin",
    handler: postLogin,
    options: {
      auth: {
        mode: 'try'
      },
      payload:{
        output:'data',
        parse: true
      }
    }
  }
];

export const adminGet: ServerRoute[] = [
  {
    method: "GET",
    path: "/admin",
    handler: getLogin,
    options: {
      auth: {
        mode: 'try'
      }
    }
  }
]

export const dashboardGet: ServerRoute[] = [
  {
    method: "GET",
    path: "/dashboard",
    handler: getDashboard
  },
  {
    method: "GET",
    path: "/service",
    handler: getService
  }
]