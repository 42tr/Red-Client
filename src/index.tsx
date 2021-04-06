// import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "layouts/App";
import reportWebVitals from "./reportWebVitals";
import { Route, Router, Switch } from "react-router-dom";
import history from "utils/history";
import { initConfig } from "config/envConfig";
import { Provider } from "react-redux";
import { store } from "reduxs";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

console.log(App)

const getApp = () => (
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </Router>
    </Provider>
  </ConfigProvider>
);

initConfig().then(() => {
  console.log('initConfig')
  setTimeout(() => {
    ReactDOM.render(getApp(), document.getElementById("root"));
  }, 0);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
