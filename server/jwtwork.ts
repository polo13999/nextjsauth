import jwt from 'jsonwebtoken'
import config from './config'
import _ from 'lodash'

const jwtwork = async (req: any) => {


    const tokenInfo = _.get(req, 'session.tokenInfo')
    console.log('  req    tokenInfo------->>>>', _.get(req, 'session'));

    if (tokenInfo) {
        try {
            const jwtData: any = jwt.verify(tokenInfo, config.secret)
            console.log('jwtData', jwtData);

            console.log('jwt驗證通過')

            return jwtData
        } catch (err) {
            console.log('err', 'jwt驗證不通過')
            return { userCode: null, userId: null }
        }
    } else {
        return { tokenInfo: null }
    }
}


export default jwtwork