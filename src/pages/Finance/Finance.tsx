import React, { useEffect } from 'react';
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

const Finance = (props: any) => {
  useEffect(() => {
    // api('')
  },[])
  return (
    <div className={styles.Approval}>
      <div className={styles.tableBox}>
        <div className={styles.h2}>
          <span>财务</span>
          <Bar />
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

export default connect(mapStateToProps, { setUserDetail })(withRouter(Finance));

