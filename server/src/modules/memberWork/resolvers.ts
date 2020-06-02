import _ from 'lodash'
import jwt from 'jsonwebtoken'
import config from '../../../config'
import { Member } from "../../../entity/Member";

const fakeData: [Member] = [{ id: 1, name: 'polo', password: '12345', account: 'polo' }]
export const resolvers: any = {
    Query: {
        meQuery: async (root: any, args: any, { connection, connectionErp, memberId }: { connection: any, connectionErp: any, memberId: any }) => {
            console.log('memberId', memberId)
            try {
                if (memberId) {
                    const member = fakeData.findIndex(v => v.id == memberId)
                    return member;
                }
                return {}
            } catch (err) {
                console.log('meQuery Err', err)
            }
        },
        memberQuery: async (root: any, args: any, { connection, connectionErp, memberId }: { connection: any, connectionErp: any, memberId: any }) => {
            return []
        },
    },

    Mutation: {
        memberLogin: async (root: any, args: any, { req }: { req: any }) => {
            let index = fakeData.findIndex(v => v.account == args.account)
            if (index == -1) { return '無此帳號' }
            let getMember: Member = fakeData[index]
            if (getMember == null) { return '' }
            try {
                const tokenInfo = jwt.sign({
                    memberId: getMember.id, account: getMember.account,
                }, config.secret, { expiresIn: '1d' })
                req.session.tokenInfo = tokenInfo
                return getMember
            } catch (err) { console.log('login err', err); return {} }
        },
        memberLogout: async (root: any, args: any, { req }: { req: any }) => {
            req.session.userToken = null
            return { status: true, message: '已經登出' }
        }
    }
}

