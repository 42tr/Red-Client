import React, { useState, useEffect } from 'react';
import styles from "./AddApproval.module.scss"
import { api } from 'utils/api'
import { Form, Input, InputNumber, Button, Select, message } from 'antd';

const { Option } = Select;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const tailLayout = {
  wrapperCol: { offset: 4, span: 20 },
};

const AddApproval = (props: any) => {
  const [form] = Form.useForm();
  // 初始化 serviceType 
  const [serviceType, setServiceType] = useState<number>(0)
  const [menu, setMenu] = useState<any[]>([]); // 申请内容菜单列表
  const [project, setProject] = useState<any[]>([]); // 项目列表列表
  // 初始化表格数据
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { match: { params } } = props
    if (serviceType !== params.serviceType) {
      setServiceType(params.serviceType * 1)
    }
  });

  useEffect(() => {
    getMenu()
    getProject()
  }, [])

  const getMenu = () => {
    // GET /approval/menu
    api('approval/menu',undefined,"GET").then((res) => {
      if(res.code === 0) {
        setMenu(res.data)
      }
    })
  }

  const getProject = () => {
    // GET /project/list   协助判断是否登录
    api('project/list',undefined,'GET').then((res: any) => {
      if(res.code === 0) {
        setProject(res.data)
      }
    })
  }

  const onFinish = (values: any) => {
    console.log(values);
    // POST /approval
    api('approval',{...values,menuId: serviceType},"POST").then((res) => {
      if(res.code === 0) {
        form.resetFields();
        message.success('申请成功！')
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
          <span>填写{menu.find((v) => v.ID === serviceType) ? menu.find((v) => v.ID === serviceType).Name : ''}申请</span>
        </div>
        <div className={styles.tableFooter}>
          <Form style={{width: '800px'}} {...layout} form={form} name="control-hooks" onFinish={onFinish}>
            <Form.Item name="projectId" label="项目" rules={[{ required: true }]}>
              <Select
                placeholder="选择项目..."
                allowClear
              >
                {
                  project.map(({id, name}) => <Option key={id} value={id}>{name}</Option>)
                }
                
              </Select>
            </Form.Item>
            <Form.Item name="money" label="金额" rules={[{ required: true }]}>
              <InputNumber style={{width: '100%'}} placeholder="输入金额..." />
            </Form.Item>
            <Form.Item name='remark' label="备注">
              <Input.TextArea placeholder="填写备注..." />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button style={{marginRight: '20px'}} type="primary" htmlType="submit">
                提交
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

export default AddApproval;
