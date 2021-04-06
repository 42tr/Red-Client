export interface appDetail {
    id:number,
    appId:string,
    appName:string,
    appDescribe:string,
    createTime:string,
    deleteStatus:number,
    secretKey:string,
    updateTime:string,
    apiConfigResponses:appDetailApi[]
}
export interface appDetailApi {
    id:string,
    apiId:string,
    name:string,
    displayName:string,
    description:string,
    serviceStatus:string,
    subscribeStatus:number
}