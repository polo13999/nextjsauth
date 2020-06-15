import { ApolloServer } from 'apollo-server-express'
import { genSchema } from './utils/genSchema'
import express from 'express'
import origin from './config/cors'
import config from './config'
import jwtwork from './jwtwork';
import http = require('http');
import cookieSession from 'cookie-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import "reflect-metadata"

const main = () => {

    const app = express()
    app.use(bodyParser.json({ limit: '10mb' }))
    app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [config.cookieKey], secure: config.production }))
    app.use(cookieParser())

    const server = new ApolloServer({
        schema: genSchema(), uploads: { maxFileSize: 10000000, maxFiles: 20 },
        context: async ({ req }: { req: any }) => {
            const tokenInfo = await jwtwork(req);
            //     console.log('-------->tokenInfo', tokenInfo);

            return { ...tokenInfo, req }
        },
        tracing: true,
        debug: !process.env.PRODUCTION,
        introspection: !process.env.PRODUCTION,
        // subscriptions: {
        //     onConnect: (connectionParams, webSocket, context) => { console.log('linking') },
        //     onDisconnect: (webSocket, context) => { console.log('byebye') },
        // },
    })

    server.applyMiddleware({ app, cors: { credentials: true, origin }, })

    const httpServer = http.createServer(app);
    httpServer.listen({ port: 5002 }, () => {
        console.log(`🚀 GraphQl Server at 開發環境 is    http://localhost:5002${server.graphqlPath}`);
    })

}

try { main() } catch (err) { console.log('err', err); }