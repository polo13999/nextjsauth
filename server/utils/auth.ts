import jwt from 'jsonwebtoken';
import _ from 'lodash';
// import bcrypt from 'bcrypt';
// import { Connection } from 'typeorm';
// import { Member } from '../src/entity/Member';

export const createTokens = async (req: any, member: any, secret: any) => {
    const tokenInfo = jwt.sign(member, secret, { expiresIn: '365d', });

    _.set(req, 'session.tokenInfo', tokenInfo)

    return tokenInfo
    //const createRefreshToken = jwt.sign({ ...loginInfo }, secret, { expiresIn: '365d', }); //這裡是簽自己的

    //  return Promise.all([createToken, createRefreshToken]);
};



// memberId: _.get(member, 'id'),
        // oAuthToken: member.accessToken,
        // oAuthRefreshToken: member.refreshToken


// export const refreshTokens = async (token: string, refreshToken: string, connectionEzclaw: Connection, SECRET: string) => {



//     let memberId = -1
//     try {
//         let result: any = jwt.verify(refreshToken, SECRET);//先拿到舊的
//         memberId = result['memberId'];
//     } catch (err) {
//         console.log('refreshToken 出了點問題', err)
//         return {};
//     }
//     const member = await connectionEzclaw.getRepository(Member).findOne(memberId)
//     const [newToken, newRefreshToken] = await createTokens(member, SECRET);
//     return { newToken: newToken, newRefreshToken: newRefreshToken, member, };
// };