import * as Hapi from '@hapi/hapi'
import * as cookie from "@hapi/cookie"
import * as vision from "@hapi/vision"
import * as Path from 'path'
import {fourohfourRoutes} from './Routes/404'
import { login } from './Routes/login';
import inert from '@hapi/inert';
import { resourceRoute } from './Routes/resources'

const init = async () => {

    const server = Hapi.server({
        port: 4000,
        host: 'localhost',
        routes:{
            files:{
                relativeTo: Path.join(__dirname, '../Frontend')
            }
        }
    });

    //initialise plugin
    await server.register([vision,inert,cookie])

    //Declare authentication strategy
    server.auth.strategy('cookie_auth', 'cookie', {
        cookie: {
            name: 'session',
            password: 'TeamS0l1d1tyisAwesomeTeamS0l1d1tyisAwesomeTeamS0l1d1tyisAwesome',
            isSecure: 'false',
            ttl: 60 * 60 * 1000
        },
    })

    //make cookie auth default auth method
    server.auth.default('cookie_auth')

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: '../Frontend/Template',
        
    });

    server.route(login)
    server.route(resourceRoute)
    //catch all routes
    server.route(fourohfourRoutes)

    await server.start();
    console.log('Server running on %s', server.info.uri);
};
  
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();

