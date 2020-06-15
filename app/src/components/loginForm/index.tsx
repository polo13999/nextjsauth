
import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { loginActionGQL } from './graphql'
import { Button, Input, message } from 'antd'
const LoginForm = () => {
    const [loginState, setLoginState] = useState({ account: 'polo', password: '12345' })
    const [mutationAction] = useMutation(loginActionGQL)
    console.log('loginState', loginState);

    return (
        <div>
            <div>
                帳號:<Input defaultValue={loginState.account} onChange={(e) => {
                    loginState.account = e.target.value;
                    setLoginState(loginState)
                }} />
                密碼:<Input type={"password"} defaultValue={loginState.password} onChange={(e) => { loginState.password = e.target.value; setLoginState(loginState) }} />
            </div>

            <div>
                <Button onClick={async () => {
                    if ((loginState.account == '') || (loginState.password == '')) { message.error('請填寫帳號密碼'); return }
                    const result = await mutationAction({ variables: loginState, refetchQueries: ['meQuery'] })

                    console.log('result', result);

                }}>一般登入</Button>
            </div>
        </div>
    )
}

export default LoginForm