import jwt from 'jsonwebtoken'
import config from './config'
import _ from 'lodash'

const jwtwork = async (req: any) => {


    const tokenInfo = _.get(req, 'session.tokenInfo')
    console.log('tokenInfo', tokenInfo);

    if (tokenInfo) {
        console.log('xxxxxxx');

        try {
            const jwtData: any = jwt.verify(tokenInfo, config.secret)
            console.log('jwtData ----->', jwtData);

            const { memberInfo } = jwtData
            return { memberInfo }
        } catch (err) {
            console.log('err', 'jwt驗證不通過')
            return { userCode: null, userId: null }
        }
    } else {
        return { tokenInfo: null }
    }
}


export default jwtwork