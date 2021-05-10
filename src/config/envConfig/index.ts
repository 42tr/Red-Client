declare global {
  interface Window {
    env: any;
  }
}

const defaultConfig = {
  // host: "http://kisia.cn:8080",
  host: "http://kisia.cn:8081",
  authHost: "http://kisia.cn:8080",
  // windowHost: "http://WORKER_IP:31221",
  debug: true,
};

const local = {
  // host: "kisia.cn:8080",
  host: "localhost:8080",
  // windowHost: "http://192.168.51.40:31221",
  debug: true,
};

export const configs: any = {
  local,
};

export const initConfig = () => {
  return new Promise((resolve,regect) => {
    interface typeJson {
      [propName: string]: any
    }
    let json: typeJson = {}
    if (json) {
      const activeConfig = json.activeConfig || "";
      const extraConfig = json.extraConfig || {};
      const workerIP = json.workerIP || "";
      console.log(`current active config: activeConfig=${activeConfig}`);
      if (!activeConfig || !configs[activeConfig]) {
        console.log('no match config found, use "defaultConfig"');
      }
      window.env = defaultConfig || {};

      const overwriteConfigMap = (configMap: any) => {
        for (const key of Object.keys(configMap)) {
          const value = window.env[key];
          window.env[key] = configMap[key];
          console.log(`overwrite ${key} from ${value} to ${configMap[key]}`);
        }
      };

      console.log("overwrite stage1");
      overwriteConfigMap(configs[activeConfig] || {});
      console.log("overwrite stage2");
      overwriteConfigMap(extraConfig || {});

      for (const key of Object.keys(window.env || {})) {
        if (window.env[key] && typeof window.env[key] === "string" && window.env[key].replace) {
          window.env[key] = window.env[key].replace("WORKER_IP", workerIP);
        }
      }
      console.log("all config available now: ", window.env);
    }
    resolve(true)
  })
  // return fetch("/config.json").then((res) => {
  //   return res.json().then((json) => {
  //     if (json) {
  //       const activeConfig = json.activeConfig || "";
  //       const extraConfig = json.extraConfig || {};
  //       const workerIP = json.workerIP || "";
  //       console.log(`current active config: activeConfig=${activeConfig}`);
  //       if (!activeConfig || !configs[activeConfig]) {
  //         console.log('no match config found, use "defaultConfig"');
  //       }
  //       window.env = defaultConfig || {};

  //       const overwriteConfigMap = (configMap: any) => {
  //         for (const key of Object.keys(configMap)) {
  //           const value = window.env[key];
  //           window.env[key] = configMap[key];
  //           console.log(`overwrite ${key} from ${value} to ${configMap[key]}`);
  //         }
  //       };

  //       console.log("overwrite stage1");
  //       overwriteConfigMap(configs[activeConfig] || {});
  //       console.log("overwrite stage2");
  //       overwriteConfigMap(extraConfig || {});

  //       for (const key of Object.keys(window.env || {})) {
  //         if (window.env[key] && typeof window.env[key] === "string" && window.env[key].replace) {
  //           window.env[key] = window.env[key].replace("WORKER_IP", workerIP);
  //         }
  //       }
  //       console.log("all config available now: ", window.env);
  //     }
  //     return Promise.resolve();
  //   });
  // });
};
