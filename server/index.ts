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
import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth'
import { SECRET } from './config/sercet'
import { createTokens } from './utils/auth'
import _ from 'lodash'

const main = () => {

    const app = express()
    app.use(bodyParser.json({ limit: '10mb' }))
    app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [config.cookieKey], secure: config.production }))
    app.use(cookieParser())




    passport.use(
        new FacebookStrategy.Strategy(
            { clientID: '2466066633486267', clientSecret: SECRET, callbackURL: 'https://clawfun.online/fbcallback', profileFields: ['id', 'email', 'displayName', 'photos'] },
            async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
                const { id, displayName, _json } = profile;
                // console.log('picture', _json.picture)
                //                const fbUser = await connectionEzclaw.getRepository(Member).findOne({ fbId: id });

                //整理要的資料回傳cb
                //  if (!fbUser) {
                // console.log('新增加會員')
                let memberObj: any = {}
                memberObj.id = 1; //之後抓資料庫
                memberObj.fbId = id;
                // memberObj.uuid = uuid.v1();
                memberObj.account = 'fd' + id;
                memberObj.orgName = displayName;
                memberObj.name = displayName;
                memberObj.fbEmail = _json.email
                memberObj.email = _json.email
                memberObj.fbPhoto = _json.picture.data.url
                // const member = await connectionEzclaw.getRepository(Member).save(memberObj)
                return cb(null, { member: memberObj, accessToken, refreshToken });
                // }
                //找到會員
                // return cb(null, { ...fbUser, accessToken, refreshToken });
            },
        ),
    );

    // passport.use(
    //     new GoogleStrategy.OAuth2Strategy({ clientID: '961187575708-e2rhuvps4up1qu2aeorkvc9s4enpl0n4.apps.googleusercontent.com', clientSecret: '___frIWDNYCLP7wK9rY1X4aX', callbackURL: 'https://clawfun.online/googlecallback', },
    //         async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
    //             try {
    //                 //console.log('profile', profile)
    //                 const { id, _json } = profile;
    //                 console.log('googleprofile', profile)

    //                 const googleUser = await connectionEzclaw.getRepository(Member).findOne({ googleId: id });
    //                 if (!googleUser) {
    //                     console.log('新增加會員')
    //                     let memberObj = new Member;
    //                     memberObj.googleId = id;
    //                     memberObj.uuid = uuid.v1();
    //                     memberObj.account = 'fd' + id;
    //                     memberObj.orgName = _json.name;
    //                     memberObj.name = _json.name;
    //                     memberObj.googleEmail = _json.email;
    //                     memberObj.email = _json.email;
    //                     memberObj.googlePhoto = _json.picture;

    //                     let member = await connectionEzclaw.getRepository(Member).save(memberObj)

    //                     console.log('member', { ...member, accessToken, refreshToken })
    //                     return cb(null, { ...member, accessToken, refreshToken });
    //                 }
    //                 return cb(null, { ...googleUser, accessToken, refreshToken });
    //             } catch (err) {
    //                 console.log('google 認證有問題 ')
    //                 return cb(null, {})
    //             }
    //         },
    //     ),
    // );
    app.get('/fblogin', passport.authenticate('facebook', { scope: 'email' }))
    // app.get('/fblogin', (req, res) => {
    //     res.send('hello world');
    // })
    app.get('/googlelogin', passport.authenticate('google', { scope: ['profile', 'email'] }))

    app.get('/fbcallback',
        passport.authenticate('facebook', { session: false }),
        async (req: any, res) => {
            const member = _.get(req, 'user.member')
            const accessToken = _.get(req, 'user.accessToken');
            const refreshToken = _.get(req, 'user.refreshToken');
            try {
                const createJwtToken = await createTokens(req, member, SECRET);  //寫入session
                console.log('req session', _.get(req, 'session.tokenInfo'))
                res.redirect(`https://clawfun.online/fbauth?token=${createJwtToken}&refreshToken=${refreshToken}`);
            } catch (err) {
                res.redirect(`https://clawfun.online/fbauthfail`);
            }
        },
    );



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





    // app.get('/googlecallback',
    //     passport.authenticate('google', { session: false }),
    //     async (req: any, res) => {
    //         try {
    //             const [token, refreshToken] = await createTokens(req.user, SECRET);
    //             if (typeof req.headers.cookie == 'string') {
    //                 try {
    //                     //console.log('re  ------>')
    //                     //const cookieKey = req.headers.cookie.split(";").filter((v: any) => v.includes('express:sess'))[0].split("=")[1]
    //                     const cookieKey = token
    //                     let userData = { token, refreshToken }
    //                     client.set(cookieKey, JSON.stringify(userData))
    //                 } catch (err) { console.log('cookies有問題Ｏ') }
    //             }
    //             //res.redirect(`https://clawfun.online`);
    //             res.redirect(`https://clawfun.online/googleauth?token=${token}&refreshToken=${refreshToken}`);
    //         } catch (err) {
    //             res.redirect(`https://clawfun.online/googleauthfail`);
    //         }
    //     },
    // );

            // if (typeof req.headers.cookie == 'string') {
                //     try {
                //         const cookieKey = token
                //         // req.headers.cookie.split(";").filter((v: any) => v.includes('express:sess'))[0].split("=")[1]
                //         console.log('cookieKey', cookieKey)
                //         let userData = { token, refreshToken }
                //         await client.set(cookieKey, JSON.stringify(userData))
                //     } catch (err) {
                //         //  console.log('cookies有問題Ｏ')
                //         res.redirect(`https://clawfun.online/fbauthfail`);
                //     }
                // }
                //res.redirect(`https://clawfun.online`);