import React, { useState, useEffect, createContext, Component } from 'react'
import { Layout, Menu, Button } from 'antd';
import MenuBlock from './memu';
import GlobalContext from '../provider/globalProvider'
const { Header, Sider, Content } = Layout;
import { Query } from 'react-apollo'
import _ from 'lodash'
import { meQuery } from './graph'
import { ColumnWidthOutlined } from '@ant-design/icons';


const LayoutTemplate = (props) => {
    const { children } = props
    const [menuState, setMenuState] = useState({ collapsed: false });
    const [globalState, setGlobalState] = useState({ collapsed: false })

    return (<Query query={meQuery} fetchPolicy={"cache-first"}>{result => {
        const { error, loading, data, refetch } = result
        if (loading) { return <div>loading</div> }; if (error) { return <div>error</div> };
        let loginInfo = _.get(data, 'meQuery');
        let loginId = _.get(data, 'meQuery.id');

        return (
            <GlobalContext.Provider value={{ globalState, setGlobalState, ...props, loginInfo, loginId }}>
                <Layout style={{ "height": "100vh" }}>
                    {/* <Sider trigger={null} collapsible collapsed={menuState.collapsed}><div className="logo" /><MenuBlock /></Sider> */}
                    <Layout>
                        <Content >
                            {children}
                        </Content>
                    </Layout>
                </Layout>
            </GlobalContext.Provider>
        )
    }}</Query>)
}

export default LayoutTemplate