import React, { Component } from "react";
import styles from "./index.module.scss";
// import defaultServiceIcon from "assets/images/service_icon.png";

interface ServiceCardProps {
  name: string;
  desc: string;
  icon: string;
  header?: JSX.Element | null;
  footer?: JSX.Element | null;
  cardClassName?: string;
  onIconClick?: Function | null;
  onFatherClick?: Function | null;
  isAnimation?: boolean
}

// const defaultProps: ServiceCardProps = {
//   name: "sample name",
//   desc: "sample description",
//   icon: "",
//   footer: null,
// };

class ServiceCard extends Component<ServiceCardProps>{
  handleIconClick = () => {
    if (this.props.onIconClick) {
      this.props.onIconClick();
    }
  };
  onFatherClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    if (this.props.onFatherClick) {
      this.props.onFatherClick();
    }
  }
  render() {
    return (
      <div className={`${styles.service_card} ${this.props.cardClassName ? this.props.cardClassName : ""}`} onClick={(e) => this.onFatherClick(e)}>
        <div className={styles.service_header}>{this.props.header}</div>
        {/* <img src={this.props.icon ? this.props.icon : defaultServiceIcon} alt="service_logo" onClick={this.handleIconClick} /> */}
        <div className={styles.service_name}>{this.props.name}</div>
        <div className={styles.service_desc}>{this.props.desc}</div>
        <div className={this.props.isAnimation ? styles.service_footerLive : styles.service_footer}>{this.props.footer}</div>
      </div>
    );
  }

};

export default ServiceCard;
