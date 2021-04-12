import React, { useState, useEffect } from 'react';
import styles from "./Staff.module.scss"
import { api } from 'utils/api'
import {
  Button, Form, message, Popconfirm, Select,
  Pagination, Table, Modal, Input
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const Staff = (props: any) => {
  const [form] = Form.useForm();
  const [type, setType] = useState<string>('add');
  const [inputDisable, setInputDisable] = useState<boolean>(false)
  // 用户数据列表
  const [dataList, setDataList] = useState<any[]>([])
  // 数据总数
  const [total, setTotal] = useState<number>(0)
  // 数据页码
  const [page, setPage] = useState<number>(1)
  // 加载控制
  const [loading, setLoading] = useState<boolean>(false)
  const [curUserId, setCurUserId] = useState<number>()
  // 表头配置
  const columns: ColumnsType<any> | undefined = [
    {
      title: '姓名',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center',
    },
    {
      title: '账号',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: '上级',
      dataIndex: 'superior',
      key: 'superior',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (args: any, record: any, index: number) => <>
      <Popconfirm
        title="确认重置为12345678"
        onConfirm={() => {
          // PUT /user/repassword/{id}
          api(`user/repassword/${args}`, null, "PUT").then((res) => {
            if(res.code === 0) {
              message.success('重置成功')
            }
          })
        }}>
        <Button style={{marginRight: '20px'}} type='primary' danger>重置密码</Button>
      </Popconfirm>
      <Button style={{marginRight: '20px'}} type='primary'
        onClick={() => {setCurUserId(args);setInputDisable(true);showModal(record); setType(args)}}>修改上级</Button>
      <Popconfirm
        title="确认删除"
        onConfirm={() => {
          // DELETE /user/manage/{id}
          api(`user/manage/${args}`, null, "DELETE").then((res) => {
            if(res.code === 0) {
              message.success('删除成功')
              getProject()
            }
          })
        }}>
      <Button type='primary' danger>删除</Button>
    </Popconfirm>
      </>
    }
  ]
  useEffect(() => {
    getProject()
  }, [])
  const [isModalVisible, setIsModalVisible] = useState(false); // 登录展示
  const showModal = (record: any) => {
    setIsModalVisible(() => true);
    form.setFieldsValue({...record})
  };

  const handleOk = () => {
    form.submit()
    setIsModalVisible(() => false);
  };

  const handleCancel = () => {
    setIsModalVisible(() => false);
    setType('add')
    form.resetFields();
    setInputDisable(false)
  };
  const getProject = () => {
    setLoading(() => true)
    // GET /user/list   协助判断是否登录
    api('user/list',undefined,'GET').then((res: any) => {
      if(res.code === 0) {
        setDataList(res.data)
        setTotal(res.data && res.data.length)
        setLoading(() => false)
      }
    })
  }
  const onFinishForm = async () => {
    const values = await form.validateFields();
    if (type === 'add') {
      api('user', values, "POST").then((res) => {
        if (res.code === 0) {
          form.resetFields();
          message.success("添加成功")
          setIsModalVisible(false)
          getProject()
        } else {
          message.error(res.msg)
        }
      })
    } else {
      api('user/superior/'+curUserId+'/'+values.superior, null, 'PUT').then((res) => {
        if (res.code === 0) {
          form.resetFields();
          message.success("修改成功")
          setIsModalVisible(false)
          getProject()
        } else {
          message.error(res.msg)
        }
      })
    }
    setInputDisable(false)
  };

  return (
    <div className={styles.AddApproval}>
      <div className={styles.tableBox}>
        <div className={styles.h2}>
          <span>员工列表</span>
          <Button onClick={() => {showModal({}); setType('add') }} type='primary'>
            添加员工
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={dataList.slice((page - 1) * 10,page * 10)}
          pagination={false}
          loading={loading}
          rowKey={((record, index) => {
            return index + ''
          })}
        />
        <div className={styles.tableFooter}>
          <span className={styles.count}></span>
          <div className={styles.Pagination}>
            <span className={styles.cont}>10条/页</span>
            <Pagination
              showSizeChanger={false}
              showQuickJumper={true}
              current={page}
              total={total}
              pageSize={10}
              size="small"
              onChange={(v: number) => {
                setPage(() => v)
              }}
            />
          </div>
          <div className={styles.btns}></div>
        </div>
      </div>
      <Modal title="员工信息" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        footer={[
          <Button key='submit' type="primary" htmlType="submit" onClick={onFinishForm}>
            确认
          </Button>,
          <Button key='cancel' htmlType="button" style={{ marginLeft: "10px" }} onClick={handleCancel}>
            取消
          </Button>
        ]}
      >
        <Form
          {...layout}
          name="basic"
          form={form}
        >
          <Form.Item
            label="姓名"
            name="nickname"
            rules={[{ required: true, message: '请输入员工姓名!' }]}
          >
            <Input disabled={inputDisable}/>
          </Form.Item>
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: '请输入员工账号!' }]}
          >
            <Input disabled={inputDisable}/>
          </Form.Item>
          <Form.Item
            label="上级"
            name="superior"
          >
            <Select defaultValue={0}>
              <Select.Option key={0} value={0}>无</Select.Option>
              {
                dataList.map(({id, nickname}) => <Select.Option key={id} value={id} disabled={id===curUserId}>{nickname}</Select.Option>)
              }
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div >
  );
}

export default Staff;
