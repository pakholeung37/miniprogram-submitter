export default {
  wxappTargetPath: "你的wxapp项目所在目录",
  bdappTargetPath: "你的bdapp项目所在目录",
  wxappExt__DEV: {
    "extEnable": true,
    "exAppid": "",
    "ext": {
      "isOem": true,
      "isModel": true,
      "aid": 1,
      "wxappAid": 1,
      "wxappId": 1,
      "wxappAppId": "",
      "wxappDomain": "",
      "wxappDomainUrl": ""
    }
  },
  /**
   * 下列属性结构如wxappExt__DEV
   */
  // wxappExt__OEMDEV,
  // wxappExt__SVR,
  // wxappExt__OEMSVR,
  /**
   * 该属性结构如小程序项目配置文件project.config.json, 以覆盖属性的方式写入
   */
  projectConfig__DEV: {
    // "description": "项目配置文件。",
    // "setting": {
    //   "urlCheck": false,
    //   "es6": true,
    //   "postcss": true,
    //   "minified": true,
    //   "newFeature": true
    // },
    // "compileType": "miniprogram",
    "libVersion": "小程序最低基础库版本",
    "appid": "小程序aid",
    // "projectname": "wxapp",
    // "simulatorType": "wechat",
    // "simulatorPluginLibVersion": {},
    // "condition": {
    //   "search": {
    //     "current": -1,
    //     "list": []
    //   },
    //   "conversation": {
    //     "current": -1,
    //     "list": []
    //   },
    //   "miniprogram": {
    //     "current": -1,
    //     "list": [
    //       {
    //         "id": 0,
    //         "name": "自定义编译",
    //         "pathName": "pages/index/index",
    //         "query": "isModel=true&wxappAid=13&wxappId=105",
    //         "scene": "1011"
    //       },
    //       {
    //         "id": 1,
    //         "name": "自定义编译1",
    //         "pathName": "pages/index/index",
    //         "query": "scene=13_103",
    //         "scene": "1048"
    //       }
    //     ]
    //   }
    // }
  },

  /**
   * 下列属性结构如wxappExt__DEV
   */
  // projectConfig__OEMDEV,
  // projectConfig__SVR,
  // projectConfig__OEMSVR,
  commonVideoPlugin: {
    "version": "你的腾讯视频的版本号",
    "provider": "的的该插件提供者aid"
  }
}