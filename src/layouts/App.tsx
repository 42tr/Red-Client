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
import { api } from "utils/api";
import {
  Form, Checkbox, Input, Layout, Menu, Modal
} from 'antd';
import { UserOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};
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
  const [form] = Form.useForm(); // 创建form表单实体

  const onFinish = (values: any) => {
    login(values.username,values.password)
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const [selectedKeys, setSelectedKeys] = useState<string>('0'); // 选中子菜单
  const [user, setUser] = useState<boolean>(false); // 是否登录
  const [isModalVisible, setIsModalVisible] = useState(false); // 登录展示
  const [menu, setMenu] = useState<any[]>([]); // 申请内容菜单列表

  const showModal = () => {
    setIsModalVisible(() => true);
  };

  const handleOk = () => {
    form.submit()
    setIsModalVisible(() => false);
  };

  const handleCancel = () => {
    setIsModalVisible(() => false);
  };
  useEffect(() => {
      // GET /project/list   协助判断是否登录
      api('project/list',undefined,'GET').then((res: any) => {
        if(res.code === '401') {
          setUser(() => false)
        } else {
          setUser(() => true)
        }
      })
      getMenu()
  }, []);

  const login = (username: string,password: string) => {
    // POST /user/login
    api('user/login',{username,password},"POST").then((res) => {
      if(res.code === 0) {
        getMenu()
        setUser(true)
        setIsModalVisible(false);
      }
    })
  }

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
                  user ? <><span onClick={() => {
                    api('user/logout',undefined,'DELETE').then((res) => {
                      // if(res === 0) {
                      //   setUser(() => false)
                      // }
                      setUser(() => false)
                    })
                  }}>
                    <LogoutOutlined
                      className={styles.LogoutOutlined}
                    />
                  </span>
                  {(props && props.user.userName) || '未知'}</> : <span onClick={() => {
                    showModal()
                    form.resetFields();
                  }}>
                    <LoginOutlined
                      className={styles.LoginOutlined}
                    />
                  </span>
                }
                
              </div>
            </div>
            <Menu theme='dark' mode="inline" selectedKeys={[selectedKeys]} defaultOpenKeys={['Approval']}
              onClick={(e: any) => {
                setSelectedKeys(e.key)
                // console.log('Menu',e.keyPath.reverse().join('/'))
                props.history.push(`/${e.keyPath.reverse().join('/')}`)
              }}
            >
              <SubMenu key="Approval" icon={<UserOutlined />} title="审批">
                {
                  ApprovalList.map(({key,name}) => <Menu.Item key={key}>{name}</Menu.Item>)
                }
              </SubMenu>
              <SubMenu key="AddApproval" icon={<UserOutlined />} title="申请">
                {
                  menu.map(({ID,Name}) => <Menu.Item key={ID}>{Name}</Menu.Item>)
                }
              </SubMenu>
              <Menu.Item key={'Project'}>{'项目列表'}</Menu.Item>
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
      <Modal title="Basic Modal" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          name="basic"
          form={form}
          initialValues={{ username: '', password: '', remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    
    </Provider>
  )
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { setUserDetail })(withRouter(App));
