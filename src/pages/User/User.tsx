import React from 'react';
import styles from "./User.module.scss"
import { apiUser } from 'utils/api'
import { Form, Input, Button, message } from 'antd';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const User = (props: any) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
    // PUT /user/password
    apiUser('user/password',{...values},"PUT").then((res) => {
      if(res.code === 0) {
        form.resetFields();
        message.success('修改成功！')
      }
    })
  };

  const onReset = () => {
    form.resetFields();
  };
  return (
    <div className={styles.AddApproval}>
      <div className={styles.tableBox}>
        <div className={styles.h2}>
          <span>修改密码</span>
        </div>
        <div className={styles.tableFooter}>
          <Form style={{width: '800px'}} {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            <Form.Item name="password" label="原密码" rules={[{ required: true, message: '请输入密码!' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="newPassword" label="新密码" rules={[{ required: true, message: '请输入密码!' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="reNewPassword" label="确认密码" rules={[{ required: true, message: '请输入密码!' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button style={{marginRight: '20px'}} type="primary" htmlType="submit">
                确认更新
              </Button>
              <Button htmlType="button" onClick={onReset}>
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    
    </div >
  );
}

export default User;
