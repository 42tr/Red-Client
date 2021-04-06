import { message } from "antd";
import { Application } from "types";
import { api } from "utils/api";

export const getAppDetail = () => {
  return Promise.resolve({
    data: [
      {
        key: "1",
        name: "通用文本服务",
        month: 0,
        first: "无限额",
        second: "暂无",
        third: "无限额",
      },
      {
        key: "2",
        name: "证件OCR服务",
        month: 0,
        first: "无限额",
        second: "暂无",
        third: "无限额",
      },
    ],
  });
};

interface BackEndApplication {
  id: number;
  appId: string;
  appName: string;
  appDescribe: string;
  secretKey: string;
  deleteStatus: number;
  createTime: string;
  updateTime: string;
  apiConfigResponses: BackEndService[];
}

interface BackEndService {
  id: number;
  apiId: string;
  name: string;
  displayName: string | null;
  description: string;
  version: string;
  apiAddress: string;
  type: string;
  serviceGroup: string;
  serviceCategory: string | null;
  concurrentLimit: number;
  rateLimit: number | null;
  requestParameterDescribe: string | null;
  responseParameterDescribe: string | null;
  requestValidatorType: string | null;
  requestValidatorPattern: string | null;
  responseValidatorType: string | null;
  responseValidatorPattern: string | null;
  serviceStatus: string;
  userName: string;
  createTime: string;
  updateTime: string;
}



/**
 * @description
 * 获取用户的应用列表
 * @param pageIndex
 * @param pageSize
 */
export function getMyApps(pageIndex: number = 1, pageSize: number = 10000): Promise<Application[] | any> {
  return api(`api/app/page?page=${pageIndex}&size=${pageSize}`, undefined, "GET").then((resp) => {
    if (resp.success) {
      if (resp.data && resp.data.length > 0) {
        const respData: BackEndApplication[] = resp.data;
        let serviceList: { apiId: string; apiName: string; author: string; version: string; serviceName: string; serviceDesc: string; algoCategory: string; serviceStatus: string; displayCategory: string; defaultQPS: number; apiNote: string; apiUrl: string; responseType: string; requestMethod: string; }[] =  [];
        respData.map((d)=>{
          return d.apiConfigResponses.filter(item=>item.serviceStatus === 'Running').forEach((s: BackEndService) =>{
            serviceList.push({
              apiId: s.apiId,
              apiName: s.name,
              author: "",
              version: s.version,
              serviceName: s.displayName || "未知服务名称",
              serviceDesc: s.description || "",
              algoCategory: s.serviceGroup || "",
              serviceStatus: s.serviceStatus || "",
              displayCategory: s.serviceCategory || "",
              defaultQPS: s.concurrentLimit || 0,
              apiNote: "",
              apiUrl: s.apiAddress || "",
              responseType: "",
              requestMethod: "",
            }) 
          })
        });
        let theMap = new Map([]);
        serviceList.forEach((item:any)=>{
          theMap.set(item.apiId,false)
        })
        let newServiceList:any[] = [];
        serviceList.forEach(element => {
          if(theMap.get(element.apiId) === false){
            theMap.set(element.apiId,true)
            newServiceList.push(element)
          }
        });
        return {appList:respData.map((d) => {
            return {
              id: d.id,
              appId: d.appId,
              appName: d.appName,
              description: d.appDescribe,
              secretKey: d.secretKey,
              deleteStatus: d.deleteStatus,
              createTime: d.createTime,
              updateTime: d.updateTime,
              serviceList: d.apiConfigResponses.filter(item=>item.serviceStatus === 'Running').map((s: BackEndService) => ({
                apiId: s.apiId,
                apiName: s.name,
                author: "",
                version: s.version,
                serviceName: s.displayName || "未知服务名称",
                serviceDesc: s.description || "",
                algoCategory: s.serviceGroup || "",
                serviceStatus: s.serviceStatus || "",
                displayCategory: s.serviceCategory || "",
                defaultQPS: s.concurrentLimit || 0,
                apiNote: "",
                apiUrl: s.apiAddress || "",
                responseType: "",
                requestMethod: "",
              })),
            };
          }),
          serList : newServiceList
        };
      } else {
        return {
          appList:[],
        };
      }
    } else {
      message.error("获取应用列表失败", resp.message || "");
      return [];
    }
  });
}

interface BackEndNewApp {
  id: number;
  appId: string;
  appName: string;
  appDescribe: string;
  secretKey: string;
  userName: string;
  deleteStatus: number;
  createTime: string;
  updateTime: string;
}

/**
 * @description
 * 创建新应用
 * @param appId // 应用唯一标识
 * @param appName // 应用名称
 * @param appDescription // 应用名称
 */
export function createNewApp(appId: string, appName: string, appDescription: string): Promise<Application | null> {
  return api(`api/app/create`, { appId, appName, appDescribe: appDescription }, "POST").then((resp) => {
    if (resp.success) {
      const respData: BackEndNewApp = resp.data;
      return {
        id: respData.id,
        appId: respData.appId,
        appName: respData.appName,
        description: respData.appDescribe,
        secretKey: respData.secretKey,
        deleteStatus: respData.deleteStatus,
        createTime: respData.createTime,
        updateTime: respData.updateTime,
        serviceList: [],
      };
    } else {
      message.error(`创建应用失败`);
      return null;
    }
  });
}

/**
 * @description
 * 检查appId是否存在
 * @param appId
 */
export function isAppIdNotUsed(appId: string) {
  return api(`api/app/exist?appId=${appId}`, undefined, "GET").then((resp) => {
    if (resp.success) {
      return !!resp.data;
    } else {
      return false;
    }
  });
}

/**
 * @description
 * 修改应用信息
 * @param appId // 应用唯一标识
 * @param appName // 应用名称
 * @param appDescription // 应用名称
 */
export function updateAppDetail(appId: string, appName: string, appDescription: string) {
  return api(`api/app/modify`, { appId, appName, appDescribe: appDescription }, "POST");
}

/**
 * @description
 * 删除应用
 * @param appId
 */
export function deleteApp(appId: string) {
  return api(`api/app/delete?appId=${appId}`, undefined, "POST");
}

interface BackEndSubscription {
  id: number;
  taskCreateUserName: string;
  taskReviewUserName: string;
  reivewUserRole: string | null;
  taskStatus: string;
  reviewDescribe: string | null;
  taskParameter: string;
  taskType: string;
  apiId: string;
  apiVersion: string;
  createTime: string | null;
  updateTime: string | null;
}

/**
 * @description
 * 应用订阅服务
 * @param appId
 * @param apiId
 * @param amount 服务调用次数
 */
export function subscribe(appId: string | null, apiId: string, amount: number) {
  return api(`api/app/subscription`, { appId, apiId, amount }, "POST").then((resp) => {
    if (resp.success) {
      message.success("服务订阅成功");
      return resp.data as BackEndSubscription;
    } else {
      message.error("订阅服务失败 ", resp.message);
      return null;
    }
  });
}

/**
 * @description
 * 应用取消订阅服务
 * @param appId
 * @param apiId
 */
export function unsubscribe(appId: string, apiId: string) {
  return api(`api/app/unsubscription`, { appId, apiId }, "POST");
}

/**
 * @description
 * 获取应用的BI统计列表数据
 * @param apiId
 * @param startTime
 * @param endTime
 */
export function getAppStatisticsTable(appId: string, startTime: string, endTime: string) {
  return api(`api/app/biEntry?appId=${appId}&startTime=${startTime}&endTime=${endTime}`);
}

/**
 * @description
 * 获取应用的BI图表数据
 * @param apiId
 * @param startTime
 * @param endTime
 */
export function getAppStatisticsChart(appId: string, startTime: string, endTime: string) {
  return api(`api/app/biChart?appId=${appId}&startTime=${startTime}&endTime=${endTime}`);
}
