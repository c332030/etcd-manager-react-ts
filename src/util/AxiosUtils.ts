/**
 * <p>
 *   Description: AxiosUtils
 * </p>
 * @author c332030（袁兴旺）
 * @version 1.0
 * @date 2019-7-16 10:09
 */

import axios, {
  AxiosInstance
  , AxiosRequestConfig
  , AxiosResponse
  , AxiosError
} from 'axios';

import {
  log
  , get
  // ,notEmpty
} from '.'

import {EtcdConfig} from "entity/vo/EtcdConfig";

const configJsonUrl = 'config.json';

/**
 * 配置信息
 */
class AxiosUtils {

  /**
   * Axios 配置信息
   */
  private axiosConfig: EtcdConfig = {};

  /**
   * Axios 实例
   */
  public axiosInstance: AxiosInstance = axios.create({

    // baseURL: "http://work.server.c332030.com:2379", // api的base_url
    // timeout: 60,

    xsrfCookieName: 'xsrf-token'
  });

  constructor(){

    this.getConfig.bind(this);

    this.axiosInstance.get(configJsonUrl).then(e => {

      // console.debug('EtcdConfig');
      // console.debug(e.data);

      this.axiosConfig = e.data;
      this.initInterceptors();
    }).catch(e => {
      log(e);
    });
  }

  /**
   * 初始化拦截器
   */
  private initInterceptors() {

    /**
     * 添加 请求报文 拦截器
     */
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {

      // log(config);

      const url = config.url;
      const configUrl = get(this.axiosConfig, 'proxy.url', '');

      if(!url) {
        throw new Error('链接为空');
      }

      if(!configUrl) {
        throw new Error('代理链接为空');
      }

      if(url === configUrl) {
        return config;
      }

      config.url = configUrl;
      config.headers.ProxyUrl = url;

      return config;
    }, (error) => {
      return Promise.reject(error);
    });

    /**
     * 添加 返回报文 拦截器
     */
    this.axiosInstance.interceptors.response.use((response: AxiosResponse) => {

      return Promise.resolve(response);
    }, (response: AxiosError) => {
      return Promise.reject(response);
    });
  }

  /**
   * 获取默认配置
   */
  public getConfig() {
    return this.axiosConfig;
  }
}

export const axiosUtils = new AxiosUtils();

export const axiosGet = axiosUtils.axiosInstance.get;
export const axiosPut = axiosUtils.axiosInstance.put;

export const axiosPost = axiosUtils.axiosInstance.post;

export const axiosDelete = axiosUtils.axiosInstance.delete;
