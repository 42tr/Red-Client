import React, { useState, useEffect } from 'react';
import styles from "./Project.module.scss"
import { api } from 'utils/api'
import {
  Button, Form, message,
  Pagination, Table, Modal, Input,
  Popconfirm
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const Project = (props: any) => {
  const [form] = Form.useForm();
  const [type, setType] = useState<string>('add');
  // 用户数据列表
  const [dataList, setDataList] = useState<any[]>([])
  // 数据总数
  const [total, setTotal] = useState<number>(0)
  // 数据页码
  const [page, setPage] = useState<number>(1)
  // 加载控制
  const [loading, setLoading] = useState<boolean>(false)
  // 表头配置
  const columns: ColumnsType<any> | undefined = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '项目描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (args: any, record: any, index: number) => <>
      <Button style={{marginRight: '20px'}} type='primary' onClick={() => {showModal(record); setType(args)}}>修改项目信息</Button>
      <Popconfirm
        title="确认删除"
        onConfirm={() => {
          // DELETE /project/{id}
          api(`project/${args}`,undefined,"DELETE").then((res) => {
            if(res.code === 0) {
              message.success('删除成功')
              getProject()
            }
          })
        }}
      >
        <Button type='primary' danger >删除</Button>
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
  };
  const getProject = () => {
    setLoading(() => true)
    // GET /project/list   协助判断是否登录
    api('project/list',undefined,'GET').then((res: any) => {
      if(res.code === 0) {
        setDataList(res.data)
        setTotal(res.data && res.data.length)
        setLoading(() => false)
      }
    })
  }

  const onFinish = (values: any) => {
    // POST /project
    // PUT /project/{id}
    if(type === 'add') {
      api('project',{...values},"POST").then((res) => {
        if(res.code === 0) {
          form.resetFields();
          getProject()
          message.success('添加成功！')
        }
      })
    } else {
      api(`project/${type}`,{...values},"PUT").then((res) => {
        if(res.code === 0) {
          form.resetFields();
          getProject()
          message.success('修改成功！')
        }
      })
    }
    setType('add')
    form.resetFields();
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className={styles.AddApproval}>
      <div className={styles.tableBox}>
        <div className={styles.h2}>
          <span>项目列表</span>
          <Button onClick={() => {showModal({}); setType('add') }} type='primary'>
            添加项目
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
      <Modal title="Basic Modal" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
      >
        <Form
          {...layout}
          name="basic"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: '请输入项目名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="项目描述"
            name="description"
            rules={[{ required: true, message: '请输入项目描述!' }]}
          >
            <Input.TextArea placeholder="项目描述..." />
          </Form.Item>
        </Form>
      </Modal>
    
    </div >
  );
}

export default Project;
