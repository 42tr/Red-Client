import React, { useEffect, useState } from 'react';
import {
  // Row,Col
} from 'antd';
import styles from "./Finance.module.scss";
// import { api } from 'utils/api'
import { withRouter } from "react-router";
import { setUserDetail } from "reduxs/user.reducer";
import { connect } from "react-redux";
import { RootState } from "reduxs";
import Bar from 'components/Bar'
import { api, apiUser } from 'utils/api';
import Line from 'components/Line';

const Finance = (props: any) => {
  const [projectData, setProjectData] = useState<any[]>([])
  const [menuData, setMenuData] = useState<any[]>([])
  const [userData, setUserData] = useState<any[]>([])
  const [timeData, setTimeData] = useState<any>({});
  useEffect(() => {
    apiUser("user/list/all", undefined, "GET").then((res) => {
      if (res.code === 0) {
        var id2Name = new Map()
        for (let data of res.data) {
          id2Name.set(data.id + '', data.nickname)
        }

        api('finance/aggregation/user').then((res) => {
          if (res.code === 0) {
            var datas = res.data
            console.log(id2Name)
            for (let data of datas) {
              console.log(data.name)
              data.name = id2Name.get(data.name)
              console.log(data.name)
            }
    
            setUserData(res.data)
          }
        })
      }
    })
    api('finance/aggregation/project').then((res) => {
      if (res.code === 0) {
        setProjectData(res.data)
      }
    })
    api('finance/aggregation/menu').then((res) => {
      if (res.code === 0) {
        setMenuData(res.data)
      }
    })

    api('finance/aggregation/time').then((res) => {
      if (res.code === 0) {
        // setUserData(res.data)
        let xData = [], yData = []
        for (let data of res.data) {
          xData.push(data.name)
          yData.push(data.value)
        }
        var data = {
          xData: xData,
          yData: yData
        }
        setTimeData(data)
      }
    })
  },[])
  return (
    <div className={styles.Approval}>
      <div className={styles.tableBox}>
        <div className={styles.h2}>
          <span>财务</span>
        </div>
        <Bar id="1" title="项目分布" data={projectData} />
          <Bar id="2" title="类型分布" data={menuData} />
          <Bar id="3" title="人员分布" data={userData} />
          <Line id="4" title="时间分布" xData={timeData.xData} yData={timeData.yData} />
      </div>
    </div>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { setUserDetail })(withRouter(Finance));

