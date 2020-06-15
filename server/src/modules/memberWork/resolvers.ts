import _ from 'lodash'
import jwt from 'jsonwebtoken'
import config from '../../../config'
import { Member } from "../../../entity/Member";

const fakeData: [Member] = [{ id: 1, name: 'polo', password: '12345', account: 'polo' }]
export const resolvers: any = {
    Query: {
        meQuery: async (root: any, args: any, { connection, connectionErp, id }: { connection: any, connectionErp: any, id: any }) => {
            console.log('memberId', id)
            try {
                if (id) {
                    const index = fakeData.findIndex(v => v.id == id)
                    return fakeData[index];
                }
                return {}
            } catch (err) {
                console.log('meQuery Err', err)
            }
        },
        memberQuery: async (root: any, args: any, { connection, connectionErp, id }: { connection: any, connectionErp: any, id: any }) => {
            return []
        },
    },

    Mutation: {
        loginAction: async (root: any, args: any, { req }: { req: any }) => {
            let index = fakeData.findIndex(v => v.account == args.account)
            if (index == -1) { return '無此帳號' }
            let getMember: Member = fakeData[index]
            if (getMember == null) { return '' }
            try {
                const tokenInfo = jwt.sign({ id: getMember.id, account: getMember.account, name: getMember.name }, config.secret, { expiresIn: '1d' })
                _.set(req, 'session.tokenInfo', tokenInfo)

                return getMember
            } catch (err) { console.log('login err', err); return {} }
        },
        logoutAction: async (root: any, args: any, { req }: { req: any }) => {
            try {
                delete req.session.tokenInfo
                return { status: true, message: '已經登出' }
            } catch (err) {
                console.log('登出失敗');

            }
        }
    }
}

