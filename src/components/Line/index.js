import React, { Component } from "react";
import styles from "./index.module.scss";
// 引入 ECharts 主模块
import * as echarts from "echarts";

export default class Line extends Component {
  constructor(props) {
    super(props);
    this.charts = null;
    this.state = {};
  }
  initCharts = () => {
    echarts.init(document.getElementById("Line" + this.props.id)).dispose(); //销毁前一个实例
    // 基于准备好的dom，初始化echarts实例
    this.charts = echarts.init(document.getElementById("Line" + this.props.id));
    this.charts.setOption({
        title: {
          text: this.props.title,
          left: "center",
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: this.props.xData
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: this.props.yData,
            type: 'line'
        }]
    });
  };
  initResize = () => {
    window.addEventListener("resize", this.handleResize);
  };

  removeResize = () => {
    window.removeEventListener("resize", this.handleResize);
  };

  handleResize = () => {
    if (this.charts && this.charts.resize) {
      this.charts.resize();
    }
  };
  componentWillUnmount() {
    this.removeResize();
  }
  componentDidMount() {
    this.initResize();
    this.initCharts();
  }
  componentDidUpdate() {
    //当图表切换的时候，重新执行
    this.initCharts();
  }
  render() {
    return <div className={styles.line} id={"Line" + this.props.id} />;
  }
}
