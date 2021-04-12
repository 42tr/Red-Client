import React, { Component } from "react";
import styles from "./index.module.scss";
// 引入 ECharts 主模块
import * as echarts from "echarts";

export default class Bar extends Component {
  constructor(props) {
    super(props);
    this.charts = null;
    this.state = {};
  }
  initCharts = () => {
    echarts.init(document.getElementById("Bar" + this.props.id)).dispose(); //销毁前一个实例
    // 基于准备好的dom，初始化echarts实例
    this.charts = echarts.init(document.getElementById("Bar" + this.props.id));
    this.charts.setOption({
      title: {
        text: "某站点用户访问来源",
        subtext: "纯属虚构",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "访问来源",
          type: "pie",
          radius: "50%",
          data: [
            { value: 1048, name: "搜索引擎" },
            { value: 735, name: "直接访问" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "联盟广告" },
            { value: 300, name: "视频广告" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
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
    return <div className={styles.pie} id={"Bar" + this.props.id} />;
  }
}
