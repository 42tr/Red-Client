import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Button,
  Pagination, Table
} from 'antd';
import styles from "./Approval.module.scss";
import { api } from 'utils/api'
import { ColumnsType } from 'antd/lib/table';
import { withRouter } from "react-router";
import { setUserDetail } from "reduxs/user.reducer";
import { connect } from "react-redux";
import { RootState } from "reduxs";

const Approval = (props: any) => {
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
      dataIndex: 'cz',
      key: 'cz',
      align: 'center',
      render: (args: any, record: any, index: number) => <Button type='primary'>查看详情</Button>
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
    setPage(() => 0)
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
  return (
    <div className={styles.Approval}>
      <div className={styles.tableBox}>
        <div className={styles.h2}>
          <span>{returnTitle(serviceType)}列表</span>
        </div>
        <Table
          columns={columns}
          dataSource={dataList.slice(page * 10,(page + 1) * 10)}
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
              current={page + 1}
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
    
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { setUserDetail })(withRouter(Approval));

