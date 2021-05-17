import React, { useEffect, useState } from 'react';
import { message, Modal, Table } from 'antd';
import styles from "./ProjectStatistics.module.scss";
// import { api } from 'utils/api'
import { withRouter } from "react-router";
import { setUserDetail } from "reduxs/user.reducer";
import { connect } from "react-redux";
import { RootState } from "reduxs";
import Bar from 'components/Bar'
import { api } from 'utils/api';
import { ColumnsType } from 'antd/lib/table';

const ProjectStatistics = (props: any) => {
  const [projectData, setProjectData] = useState<any[]>([])
  const [areaData, setAreaData] = useState<any[]>([])
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [detailData, setDetailData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

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
  useEffect(() => {
    api("project/income/statistics/project", undefined, "GET").then((res) => {
      if (res.code === 0) {
        setProjectData(res.data)
      } else {
        message.error(res.msg)
      }
    })
    api("project/income/statistics/area", undefined, "GET").then((res) => {
      if (res.code === 0) {
        setAreaData(res.data)
      } else {
        message.error(res.msg)
      }
    })
  },[])
  const qryIncome = (id: number) => {
    setLoading(true)
    api(`project/income/detail/project/${id}`, undefined, "GET").then((res) => {
      setLoading(false)
      if (res.code === 0) {
        setDetailData(res.data)
      }
    })
  }
  const qryAreaIncome = (id: number) => {
    setLoading(true)
    api(`project/income/detail/area/${id}`, undefined, "GET").then((res) => {
      setLoading(false)
      if (res.code === 0) {
        setDetailData(res.data)
      }
    })
  }
  return (
    <div className={styles.Approval}>
      <div className={styles.tableBox}>
        <div className={styles.h2}>
          <span>项目统计</span>
        </div>
        <Bar id="1" title="项目分布" data={projectData} callback={(param:any)=>{
          setIsDetailModalVisible(true)
          qryIncome(param.data.id)
        }} />
        <Bar id="2" title="地区分布" data={areaData} callback={(param:any)=>{
          setIsDetailModalVisible(true)
          qryAreaIncome(param.data.name)
        }} />
      </div>

      <Modal title="详情" visible={isDetailModalVisible} onCancel={() => {setIsDetailModalVisible(false)}}
        footer={null} width={1000}>
        <Table columns={detailColumns} dataSource={detailData} pagination={false} loading={loading}
          rowKey={((record, index) => {
            return index + ''
          })}
        />
      </Modal>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { setUserDetail })(withRouter(ProjectStatistics));

