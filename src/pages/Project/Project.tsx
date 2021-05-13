import React, { useState, useEffect } from 'react';
import styles from "./Project.module.scss"
import { api } from 'utils/api'
import {
  Button, Form, message,
  Pagination, Table, Modal, Input,
  Popconfirm,
  Select,
  DatePicker
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const Project = (props: any) => {
  const [form] = Form.useForm();
  const [incomeForm] = Form.useForm();
  const [type, setType] = useState<string>('add');
  // 用户数据列表
  const [dataList, setDataList] = useState<any[]>([])
  const [projectId, setProjectId] = useState<number>(0)
  // 数据总数
  const [total, setTotal] = useState<number>(0)
  // 数据页码
  const [page, setPage] = useState<number>(1)
  // 加载控制
  const [loading, setLoading] = useState<boolean>(false)
  const [detailData, setDetailData] = useState<any[]>([])
  const [typeList] = useState<string[]>([])
  // 表头配置
  const detailColumns: ColumnsType<any> | undefined = [
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    }
  ]
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
        <Button style={{marginRight: '20px'}} type='primary' danger >删除</Button>
      </Popconfirm>
      <Button type='primary' onClick={() => {
        setIsDetailModalVisible(true);
        qryIncome(args);
        setProjectId(args)
      }}>查看详情</Button>
      </>
    }
  ]
  useEffect(() => {
    api('api/dic',undefined,'GET').then((res: any) => {
      if(res.code === 0) {
        console.log(res.data)
        res.data.forEach((m: any) => {
          if (m.category === '收入类型' && typeList.indexOf(m.name) < 0) {
            typeList.push(m.name)
          }
        });
        console.log(typeList)
        setLoading(() => false)
      }
    })
    getProject()
  }, [typeList])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = (record: any) => {
    setIsModalVisible(() => true);
    form.setFieldsValue({...record})
  };
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const qryIncome = (id: number) => {
    api(`project/income/detail/${id}`, undefined, "GET").then((res) => {
      if (res.code === 0) {
        setDetailData(res.data)
      }
    })
  }

  const handleOk = () => {
    form.submit()
    setIsModalVisible(() => false);
  };
  const incomeHandleOk = () => {
    incomeForm.submit()
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
    console.log(values)
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
  // const onIncomeFinish = (values: any) => {
  //   values.date = moment(values.date).format('YYYY-MM-DD')
  //   console.log(values)
  //   incomeForm.resetFields();
  //   setIsIncomeModalVisible(false);
  // };
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
      <Modal title="项目信息" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} >
        <Form {...layout} name="basic" form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} >
          <Form.Item label="项目名称" name="name" rules={[{ required: true, message: '请输入项目名称!' }]} >
            <Input />
          </Form.Item>
          <Form.Item label="项目描述" name="description" rules={[{ required: true, message: '请输入项目描述!' }]} >
            <Input.TextArea placeholder="项目描述..." />
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="详情" visible={isDetailModalVisible} onCancel={() => {setIsDetailModalVisible(false)}}
        footer={null} width={1000}>
        <Button onClick={() => {setIsIncomeModalVisible(true)}} type='primary'>
          添加
        </Button>
        <Table columns={detailColumns} dataSource={detailData} pagination={false} loading={loading}
          rowKey={((record, index) => {
            return index + ''
          })}
        />
      </Modal>
      <Modal title="新增收入" visible={isIncomeModalVisible} onOk={incomeHandleOk}
        onCancel={() => {setIsIncomeModalVisible(false)}} >
        <Form {...layout} name="basic" form={incomeForm} onFinish={(values: any) => {
            values.date = moment(values.date).format('YYYY-MM-DD')
            values.amount = parseFloat(values.amount)
            values.projectId = projectId
            console.log(values)
            incomeForm.resetFields();
            setIsIncomeModalVisible(false);
            api('project/income/detail', values, "POST").then((res) => {
              if (res.code === 0) {
                message.info("新增成功")
                qryIncome(projectId)
              } else {
                message.error(res.msg)
              }
            })
          }} onFinishFailed={onFinishFailed} >
          <Form.Item label="类型" name="type" rules={[{ required: true }]}>
            <Select>
              {
                typeList.map((type, index) => <Select.Option key={index} value={type}>{type}</Select.Option>)
              }
            </Select>
          </Form.Item>
          <Form.Item label="金额" name="amount" rules={[{ required: true, message: '请输入金额!' }]} >
            <Input />
          </Form.Item>
          <Form.Item label="日期" name="date" rules={[{ required: true }]} >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    
    </div >
  );
}

export default Project;
