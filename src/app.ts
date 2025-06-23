// 运行时配置
import { getToken, getUserInfo, logout } from '@/services/auth';
import { history } from '@umijs/max';
import { message } from 'antd';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
export async function getInitialState(): Promise<{
  name?: string;
  currentUser?: any;
  settings?: any;
}> {
  // 获取当前用户信息
  const currentUser = getUserInfo();

  if (currentUser) {
    return {
      name: currentUser.name,
      currentUser,
      settings: {},
    };
  }

  return {
    name: '@umijs/max',
    settings: {},
  };
}

export const layout = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
  };
};

// 请求配置
export const request = {
  timeout: 10000,
  errorConfig: {
    errorThrower: (res: any) => {
      throw new Error(res.message || '请求失败');
    },
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;

      if (error?.response?.status === 401) {
        // 未授权，清除登录信息并跳转到登录页
        logout();
        const currentPath = history.location.pathname;
        if (currentPath !== '/login') {
          history.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          message.error('登录已过期，请重新登录');
        }
        return;
      }

      console.error('请求错误:', error);
      message.error(error?.message || '网络异常');
    },
  },
  requestInterceptors: [
    (config: any) => {
      // 添加认证头
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      // 统一处理响应
      const { data } = response;

      if (data?.success === false) {
        throw new Error(data.message || '请求失败');
      }

      return response;
    },
  ],
};
