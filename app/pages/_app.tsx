import React from 'react'
import App from 'next/app'
import Layout from '../src/layout'
import zh_TW from 'antd/lib/locale-provider/zh_TW'
import { ConfigProvider } from 'antd'
import { ApolloProvider } from 'react-apollo'
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks'
import withApollo from '../lib/withApollo'

import 'antd/dist/antd.less'
import '../assets/body.less'
import { ApolloClient } from 'apollo-boost';


export const PagePermissionContext = React.createContext({ pagePermission: {} })
interface Props { apolloClient: ApolloClient<any> }
class MyApp extends App<Props>{

    render() {
        const { Component, apolloClient } = this.props
        return (
            <ApolloProvider client={apolloClient}>
                <ApolloHooksProvider client={apolloClient}>
                    <ConfigProvider locale={zh_TW}>
                        <Layout>
                            <Component />
                        </Layout>
                    </ConfigProvider>
                </ApolloHooksProvider>
            </ApolloProvider>
        )
    }
}

export default withApollo(MyApp)
