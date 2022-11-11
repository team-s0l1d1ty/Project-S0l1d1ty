import * as Hapi from '@hapi/hapi'
import * as inert from "@hapi/inert"
import * as cookie from "@hapi/cookie"
import * as vision from "@hapi/vision"
import * as Path from 'path'
import { getFullDid } from './Auth/authentication'
import { revokeCreds } from './Routes/revoke'
import {fourohfourRoutes} from './Routes/404'
import { attesters } from './Routes/attestter'
import { claimers} from './Routes';
import {  adminGet, adminPOST, dashboardGet } from './Routes/admin';
import { resourceRoute } from './Routes/resources'

const init = async () => {

    // server side rendering

    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes:{
            files:{
                relativeTo: Path.join(__dirname, '../Test_Frontend'),
            }
        }
    });

    //initialise plugins
    await server.register([vision,inert,cookie])  
    //Declare authentication strategy
    server.auth.strategy('cookie_auth', 'cookie', {
        cookie: {
            name: 'session',
            password: 'TeamS0l1d1tyisAwesomeTeamS0l1d1tyisAwesomeTeamS0l1d1tyisAwesome',
            isSecure: 'false'
        },
    })

    //make cookie auth default auth method
    server.auth.default('cookie_auth')

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: '../Test_Frontend/Javascript',
        
    });

    //Application Routes
    server.route(claimers)
    server.route(attesters)
    server.route(revokeCreds)
    server.route(adminPOST)
    server.route(adminGet)
    server.route(dashboardGet)
    //declare routes for resources
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

