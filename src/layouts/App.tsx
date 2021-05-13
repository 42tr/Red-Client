import React, { useState, useEffect } from "react";
import {
  Route, Switch,
  Redirect 
} from "react-router-dom";
import styles from "./App.module.scss";
import { routes } from "routes";
import { withRouter } from "react-router";
import { setUserDetail } from "reduxs/user.reducer";
import { connect } from "react-redux";
import { RootState } from "reduxs";
import Provider from 'Store/provider';
import { api, apiUser } from "utils/api";
import {
  Layout, Menu
} from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

interface IApprovalList {key: string, name: string}

const ApprovalList: IApprovalList[] = [
  {
    key: '0',
    name: '待处理'
  },
  {
    key: '1',
    name: '已处理'
  },
  {
    key: '2',
    name: '已发起'
  },
  {
    key: '3',
    name: '我收到的'
  },
]

const App = (props: any) => {
  const [selectedKeys, setSelectedKeys] = useState<string>('0'); // 选中子菜单
  const [menu, setMenu] = useState<any[]>([]); // 申请内容菜单列表


  useEffect(() => {
      const { location: { pathname } } = props
      let arr = pathname.split('/')
      setSelectedKeys(() => arr[arr.length - 1])
      // check login status
      apiUser('user/checkStatus',undefined,'GET').then((res: any) => {
        if (res === null) {
          window.location.href = 'http://kisia.cn:8080?url=' + window.location.href
        }
      })
      getMenu()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMenu = () => {
    // GET /approval/menu
    api('approval/menu',undefined,"GET").then((res) => {
      if(res.code === 0) {
        setMenu(res.data)
      }
    })
  }

  return (
    <Provider>
      <div className={styles.App}>
        <Layout>
          <Sider
            style={{
              overflow: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              // background: '#fff'
            }}
          >
            <div className={styles.header}>
              {/* <img src={logo} alt="rich_logo" /> */}
              <div className={styles.title}>OA审批</div>
              <div className={styles.titleBox}>
                {
                  <><span onClick={() => {
                    apiUser('user/logout',undefined,'DELETE').then((res) => {
                      window.location.href = 'http://kisia.cn:8080?url=' + window.location.href
                    })
                  }}>
                    <LogoutOutlined
                      className={styles.LogoutOutlined}
                    />
                  </span>
                  {(props && props.user.userName) || '未知'}</>
                }
              </div>
            </div>
            <Menu theme='dark' mode="inline" selectedKeys={[selectedKeys]} defaultOpenKeys={['Approval']}
              onClick={(e: any) => {
                setSelectedKeys(e.key)
                props.history.push(`/${e.keyPath.reverse().join('/')}`)
              }}
            >
              <SubMenu key="Approval" icon={<UserOutlined />} title="审批">
                {
                  ApprovalList.map(({key,name}) => <Menu.Item key={key + ''}>{name}</Menu.Item>)
                }
              </SubMenu>
              <SubMenu key="AddApproval" icon={<UserOutlined />} title="申请">
                {
                  menu.map(({ID,Name}) => <Menu.Item key={ID + ''}>{Name}</Menu.Item>)
                }
              </SubMenu>
              <Menu.Item key={'Project'}>{'项目列表'}</Menu.Item>
              <Menu.Item key={'ProjectStatistics'}>{'项目统计'}</Menu.Item>
              <Menu.Item key={'Finance'}>{'财务'}</Menu.Item>
              <Menu.Item key={'Staff'}>{'人员'}</Menu.Item>
              <Menu.Item key={'User'}>{'修改密码'}</Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout" style={{ marginLeft: 200 }}>
            {/* <Header className="site-layout-background" style={{ padding: 0 }} /> */}
            <Content style={{ overflow: 'initial' }}>
            <Switch>
                {routes.map((route, index) => {
                  return <Route key={index} path={route.path} component={route.component} />;
                })}
                <Redirect to={routes[0].path + '/0'} />
              </Switch>
            </Content>
            {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
          </Layout>
        </Layout>
      </div>
    
    </Provider>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { setUserDetail })(withRouter(App));
