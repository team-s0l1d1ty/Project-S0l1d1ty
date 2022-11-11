import { 
    Request, 
    ResponseToolkit, 
    ResponseObject, 
    ServerRoute 
} from "@hapi/hapi";

  export const resourceRoute: ServerRoute[] = [
    {
      method: "GET",
      path: '/css/{p*}',
      handler: {
        directory:{
          path: '../Frontend/css'
        }
      },
      options: {
        auth: {
          mode: 'try'
        }
      }
    },
    {
      method: "GET",
      path: '/Javascript/{p*}',
      handler: {
        directory:{
          path: '../Frontend/Javascript'
        }
      },
      options: {
        auth: {
          mode: 'try'
        }
      }
    }
  ]

  export const jsRoute: ServerRoute[] = [
    {
      method: "GET",
      path: '/Javascript/{p*}',
      handler: {
        directory:{
          path: '../Frontend/Javascript'
        }
      },
      options: {
        auth: {
          mode: 'try'
        }
      }
    }
  ]
  