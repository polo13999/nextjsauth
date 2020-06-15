import React from 'react'
import { Button, Divider, Input } from 'antd'
import LoginForm from '../src/components/loginForm'
import { meQuery } from '../src/layout/graph'
import { useQuery } from 'react-apollo'
import LogoutForm from '../src/components/logoutForm'







const index = (props) => {

    const result = useQuery(meQuery, { fetchPolicy: 'cache-and-network' })
    const { loading, error, data } = result
    if (loading) { return <div>loading</div> }
    if (error) { return <div>error</div> }
    // console.log('data', data);
    const id = data?.meQuery?.id

    return (
        <div>
            {id ? <div>{data?.meQuery?.name} <LogoutForm /> </div> : <LoginForm />}
            <Divider />
            <Button>Fb登入</Button>
            <Button>Google登入</Button>

        </div>
    )
}
export default index