import { 
    Request, 
    ResponseToolkit, 
    ResponseObject, 
    ServerRoute 
} from "@hapi/hapi";

async function fourohfour(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const response = h.response('The page was not found');
    response.code(404);
    return response;
  }
  
  export const fourohfourRoutes: ServerRoute[] = [
    {
      method: "*",
      path: '/{p*}',
      handler: fourohfour,
      options: {
        auth: {
          mode: 'try'
        }
      }
    },
  ];