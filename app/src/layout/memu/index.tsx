import { useContext } from 'react'
import { Menu, message } from "antd";
import { EditOutlined, LogoutOutlined } from '@ant-design/icons';

import GlobalContext from '../../provider/globalProvider'
import { useMutation } from 'react-apollo';
import { gql } from 'apollo-boost'

const SubMenu = Menu.SubMenu;


const MenuBlock = (props) => {
    const logoutGql = gql` mutation memberLogout {  userLogout{token} }`
    const [logoutAction: any] = useMutation(logoutGql)
    const { globalState, setGlobalState } = useContext(GlobalContext)

    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>



            < Menu.Item key="logout" onClick={async () => {
                const result = await logoutAction()
                console.log('result', result);

                const { error, } = logoutAction[1]
                if (!error) {
                    setGlobalState({ fnPage: 'userLogin', loggedInUser: null })
                    window.location.reload()
                } else {
                    message.error('登出有問題')
                }

            }}> <LogoutOutlined /> <span>登出</span>
            </Menu.Item >

        </Menu >)

}

export default MenuBlock

