import { message } from "antd";

function removeDoubleQuotations(language: string) {
  return language ? language.split('"').join("") : "en-US";
}

export const fullAddressApi = (
  apiFullAddress: string,
  body = null,
  method: string = "POST",
  redirectWhen401 = true,
  credentials = "include",
  isFile = false,
  showError = true,
  headers: any = {},
) => {
  const config: any = {
    method: method || "GET",
    headers: {
      Accept: "*/*",
      "Accept-Language": removeDoubleQuotations(window.localStorage.locale),
    },
    credentials,
  };

  if (body) {
    config.method = method || "POST";
    if (!isFile) {
      config.headers["Content-Type"] = "application/json";
    }
    if (typeof body === "string" || isFile) {
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }

  if (headers) {
    for (const headerKey of Object.keys(headers)) {
      config.headers[headerKey] = headers[headerKey];
    }
  }

  return fetch(apiFullAddress, config)
    .then((res) => {
      if (res.status === 204) return Promise.resolve(null);
      const contentType = res.headers.get("Content-Type") || "";
      if (res.status < 400) {
        if (!(contentType.indexOf("json") >= 0)) {
          return res.text().catch((err) => {
            if (err instanceof Error && err.message && err.message.indexOf("JSON")) {
              return Promise.resolve(null); // skip empty json error
            }
            throw err;
          });
        } else {
          return res.json().catch((err) => {
            if (err instanceof Error && err.message && err.message.indexOf("JSON")) {
              return Promise.resolve(null); // skip empty json error
            }
            throw err;
          });
        }
      }
      if (res.status === 404) {
        return Promise.reject(res);
      }
      if (!(contentType.indexOf("json") >= 0)) {
        return res.text().then((json: any) => {
          console.log(res.status, redirectWhen401, res, json);
          if (res.status === 401 && redirectWhen401) {
            // if (json && json.authUrl) {
            //   window.location.href = json.authUrl;
            // }
          }
          return Promise.reject(json);
        });
      } else {
        return res.json().then((json) => {
          // console.log(res.status, redirectWhen401, res);
          if (res.status === 401 && redirectWhen401) {
            // if (json && json.authUrl) {
            //   window.location.href = json.authUrl;
            // }
          }
          return Promise.reject(json);
        });
      }
    })
    .then((json) => {
      if (json && json.Error && showError) {
        message.error(json.Error, 5);
        return Promise.reject(json);
      }
      return json;
    })
    .catch((json) => {
      if (showError) {
        message.error(json.message || "API请求错误，请联系后台管理员", 5);
      }
      return Promise.reject(json);
    });
};

export const api = (api: string, body: any = null, method: string = "POST", redirectWhen401 = true, isFile = false, showError = true, headers = {}) => {
  return fullAddressApi(`${window.env.host}/${api}`, body, method, redirectWhen401, "include", isFile, showError, headers);
};

export const apiWithFullHost = (api: string, body = null, method: string = "POST", redirectWhen401 = true, isFile = false, showError = true, headers = {}) => {
  return fullAddressApi(`${api}`, body, method, redirectWhen401, "include", isFile, showError, headers);
};
