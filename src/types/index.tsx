// import { CreateServiceRequest } from "http/service.http";

export interface Application {
  id: number;
  appId: string; // 应用唯一表示
  appName: string; // 应用名称
  description: string; // 应用描述
  secretKey: string; // 秘钥
  deleteStatus: number; // 删除状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  serviceList: Service[];
}

export type ServiceRequestMethod = "POST" | "GET";
export interface Service {
  apiId: string;
  apiName: string;
  author: string;
  version: string;
  serviceName: string;
  serviceDesc: string;
  algoCategory: string;
  displayCategory: string;
  defaultQPS: number;
  apiNote: string;
  apiUrl: string;
  responseType?: string;
  requestMethod?: ServiceRequestMethod;
  [key: string]: any;
}

export type ServiceAuditTaskStatus = "Subscribe" | "Create" | "Upgrade" | "Stop" | "Rollback" | "Update" | null | undefined;
export type ServiceAuditTaskType = "Unchecked" | "Reject" | "APPROVED" | null | undefined;
export interface ServiceAuditTask {
  id: number;
  type: ServiceAuditTaskType;
  status: ServiceAuditTaskStatus;
  description: string;
  createTime: string;
  updateTime: string;
}

export type InputType = "text" | "textarea" | "number" | "json" | undefined;

export interface Field {
  label: string;
  isEditing: boolean;
  value: any;
  fieldType: "serviceField" | "serviceTable";
  inputType?: InputType;
  onChange?: (value: any) => void;
  onBtnChange?: (value: any) => void;
  // requestKey?: keyof CreateServiceRequest;
  [key: string]: any;
}

export interface ServiceRequest {
  key: string;
  name: string;
  isOptional: boolean;
  type: string;
  desc: string;
}

export interface ServiceResponse {
  key: string;
  name: string;
  type: string;
  desc: string;
}

export type ServiceSubmissionType = "Subscribe" | "Create" | "Upgrade" | "Stop" | "Rollback" | "Update";
export type ServiceSubmissionStatus = "Unchecked" | "Reject" | "APPROVED";
