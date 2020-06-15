
import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { logoutActionGQL } from './graphql'
import { Button, Input, message } from 'antd'
import { ApolloConsumer, } from "@apollo/react-hooks";
const LogoutForm = (props) => {
    const [mutationAction] = useMutation(logoutActionGQL)

    return <ApolloConsumer>{(apolloClient) => {
        return (
            <div>

                <div>
                    <Button onClick={async () => {

                        const result = await mutationAction({ refetchQueries: ['meQuery'], awaitRefetchQueries: true })

                    }}>登出</Button>
                </div>
            </div>
        )
    }}</ApolloConsumer>
}

export default LogoutForm