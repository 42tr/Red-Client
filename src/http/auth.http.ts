import { api } from "utils/api";

// 获取用户信息
export function auth() {
    return api("auth/checkStatus", undefined, "GET");
}