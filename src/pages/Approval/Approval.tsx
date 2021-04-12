import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Button,
  Pagination, Table,
  Modal,
  Row,Col,
  Popconfirm
} from 'antd';
import styles from "./Approval.module.scss";
import { api } from 'utils/api'
import { ColumnsType } from 'antd/lib/table';
import { withRouter } from "react-router";
import { setUserDetail } from "reduxs/user.reducer";
import { connect } from "react-redux";
import { RootState } from "reduxs";

const Approval = (props: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // 登录展示
  const [detail, setDetail] = useState<any>(null);
  // 表头配置
  const columns: ColumnsType<any> | undefined = [
    {
      title: '项目',
      dataIndex: 'projectName',
      key: 'projectName',
      align: 'center',
    },
    {
      title: '申请内容',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '申请人',
      dataIndex: 'applyUserName',
      key: 'applyUserName',
      align: 'center',
    },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      key: 'applyDate',
      align: 'center',
      render: (args: any, record: any, index: number) => args && moment(args).format('YYYY年MM月DD日')
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (id: any, record: any, index: number) => <Button type='primary' onClick={() => {
        // GET /approval/detail/{id}
        api(`approval/detail/${id}`,undefined,"GET").then((res) => {
          if(res.code === 0) {
            setDetail(() => res.data)
            setIsModalVisible(() => true)
          }
        })
        
      }}>查看详情</Button>
    }
  ]
  // 初始化 serviceType 
  const [serviceType, setServiceType] = useState<number>(0)
  // 初始化表格数据
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { match: { params } } = props
    if (serviceType !== params.serviceType) {
      setServiceType(params.serviceType * 1)
    }
  });
  // 用户数据列表
  const [dataList, setDataList] = useState<any[]>([])
  // 数据总数
  const [total, setTotal] = useState<number>(0)
  // 数据页码
  const [page, setPage] = useState<number>(1)
  // 加载控制
  const [loading, setLoading] = useState<boolean>(false)

  // 初始化表格数据
  useEffect(() => {
    setPage(() => 1)
    getDataList()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType]);

  const getDataList = () => {
    setLoading(() => true)
    // GET /auth/users
    api(`approval/list/${serviceType}`, undefined, 'GET').then((res) => {
      if (res.code === 0) {
        setLoading(() => false)
        setDataList(() => res.data || [])
        setTotal(() => res.data && res.data.length)
      }
    })

  }
  const returnTitle = (serviceType: number) => {
    switch (serviceType) {
      case 0:
        return '待处理'
      case 1:
        return '已处理'
      case 2:
        return '已发起'
      case 3:
        return '我收到的'
      default:
        break;
    }
  }
  const handleOk = () => {
    setIsModalVisible(() => false);
    setPage(() => 1)
    getDataList()
  };

  const handleCancel = () => {
    setIsModalVisible(() => false);
    setPage(() => 1)
    getDataList()
  };
  return (
    <div className={styles.Approval}>
      <div className={styles.tableBox}>
        <div className={styles.h2}>
          <span>{returnTitle(serviceType)}列表</span>
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
        // onOk={handleOk} 
        footer={<>
          {
            returnTitle(serviceType) === '待处理' && <Popconfirm
            title="确认同意？"
            onConfirm={() => {
              // PUT /approval/{id}/{status}
              api(`approval/${detail.id}/1`,undefined,"PUT")
              handleOk()
            }}
          >
            <Button style={{margin: '0 10px'}} type='primary' >同意</Button>
          </Popconfirm>
          }
          {
            returnTitle(serviceType) === '待处理' && <Popconfirm
            title="确认拒绝？"
            onConfirm={() => {
              // PUT /approval/{id}/{status}
              api(`approval/${detail.id}/2`,undefined,"PUT")
              handleOk()
            }}
          >
            <Button style={{margin: '0 10px'}} type='primary' danger >拒绝</Button>
          </Popconfirm>
          }
          {
            returnTitle(serviceType) === '已处理' && <Popconfirm
            title="确认改为待处理？"
            onConfirm={() => {
              // PUT /approval/{id}/{status}
              api(`approval/${detail.id}/0`,undefined,"PUT")
              handleOk()
            }}
          >
            <Button style={{margin: '0 10px'}} type='primary' danger >改为待处理</Button>
          </Popconfirm>
          }
          {
            returnTitle(serviceType) === '已发起' &&<Popconfirm
            title="确认撤回？"
            onConfirm={() => {
              // PUT /approval/{id}/{status}
              api(`approval/${detail.id}/3`,undefined,"PUT")
              handleOk()
            }}
          >
            <Button style={{margin: '0 10px'}} type='primary' danger >撤回</Button>
          </Popconfirm>
          }
        </>}
        onCancel={handleCancel}
      >
        {
          detail && <>
          <Row>
          <Col span={4} style={{textAlign: 'right'}}>
            项目名称：
          </Col>
          <Col>{detail.projectName || '未知'}</Col>
        </Row>
        <Row>
          <Col span={4} style={{textAlign: 'right'}}>
            申请内容：
          </Col>
          <Col>{detail.name || '未知'}</Col>
        </Row>
        <Row>
          <Col span={4} style={{textAlign: 'right'}}>
            申请人：
          </Col>
          <Col>{detail.applyUserName || '未知'}</Col>
        </Row>
        <Row>
          <Col span={4} style={{textAlign: 'right'}}>
            申请时间：
          </Col>
          <Col>{detail.applyDate && moment(detail.applyDate).format('YYYY年MM月DD日')}</Col>
        </Row>
        {
          (returnTitle(serviceType) === '已处理' || returnTitle(serviceType) === '我收到的') && <Row>
          <Col span={4} style={{textAlign: 'right'}}>
            处理时间：
          </Col>
          <Col>{detail.handleDate && moment(detail.handleDate).format('YYYY年MM月DD日')}</Col>
        </Row>
        }
        
        {
          returnTitle(serviceType) === '我收到的' && <Row>
          <Col span={4} style={{textAlign: 'right'}}>
            状态：
          </Col>
          <Col>{returnTitle(serviceType)}</Col>
        </Row>
        }
        <Row>
          <Col span={4} style={{textAlign: 'right'}}>
            金额：
          </Col>
          <Col>{detail.money || '未知'}</Col>
        </Row>
        <Row>
          <Col span={4} style={{textAlign: 'right'}}>
            备注：
          </Col>
          {/* <Col>{detail.remarks || '未知'}</Col> */}
        </Row>
          </>
        }
      </Modal>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { setUserDetail })(withRouter(Approval));

