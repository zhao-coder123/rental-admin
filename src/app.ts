// 运行时配置
import RightContent from '@/components/RightContent';
import { getToken, getUserInfo, logout } from '@/services/auth';
import { history } from '@umijs/max';
import { message } from 'antd';
import React from 'react';

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

export const layout = ({ initialState }: { initialState: any }) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    title: '房屋租赁管理系统',
    layout: 'mix',
    fixedHeader: true,
    fixSiderbar: true,
    colorWeak: false,
    splitMenus: false,
    navTheme: 'dark',
    headerHeight: 48,
    // 右侧内容区域 - 自定义用户信息组件
    rightContentRender: () =>
      React.createElement(RightContent, {
        currentUser: initialState?.currentUser,
      }),
    onMenuHeaderClick: () => history.push('/'),
    menuHeaderRender: undefined,
    // 页脚配置
    footerRender: () => {
      return null;
    },
    // 菜单的折叠收起事件
    onCollapse: (collapsed: boolean) => {
      console.log('菜单折叠状态：', collapsed);
    },
    // 退出登录
    onLogout: () => {
      logout();
      message.success('已安全退出');
      history.push('/login');
    },
  };
};

// 检查是否需要登录
const shouldRedirectToLogin = (pathname: string) => {
  const publicPaths = ['/login', '/register'];
  return !publicPaths.includes(pathname);
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

      const { response, message: errorMessage } = error;

      // 处理不同的HTTP状态码
      if (response) {
        const { status, data } = response;

        switch (status) {
          case 401: {
            // 未授权，清除登录信息并跳转到登录页
            logout();
            const currentPath = history.location.pathname;
            if (shouldRedirectToLogin(currentPath)) {
              history.push(
                `/login?redirect=${encodeURIComponent(currentPath)}`,
              );
              message.error('登录已过期，请重新登录');
            }
            break;
          }

          case 403:
            message.error('您没有权限访问此资源');
            break;

          case 404:
            message.error('请求的资源不存在');
            break;

          case 500:
            message.error('服务器内部错误，请稍后重试');
            break;

          default:
            message.error(
              data?.message || errorMessage || `请求失败 (${status})`,
            );
        }
      } else {
        // 网络错误或其他错误
        if (errorMessage?.includes('timeout')) {
          message.error('请求超时，请检查网络连接');
        } else if (errorMessage?.includes('Network Error')) {
          message.error('网络连接异常，请检查网络设置');
        } else {
          message.error(errorMessage || '网络异常，请稍后重试');
        }
      }

      console.error('请求错误:', error);
    },
  },
  requestInterceptors: [
    (config: any) => {
      // 添加认证头
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 添加请求时间戳，防止缓存
      if (config.method?.toLowerCase() === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now(),
        };
      }

      return config;
    },
  ],
  responseInterceptors: [
    (response: any) => {
      // 统一处理响应
      const { data } = response;

      // 检查业务状态码
      if (data && typeof data === 'object') {
        if (data.success === false) {
          // 业务逻辑错误
          throw new Error(data.message || '业务处理失败');
        }

        if (data.code && data.code !== 200 && data.code !== 0) {
          // 非成功状态码
          throw new Error(data.message || `业务错误 (${data.code})`);
        }
      }

      return response;
    },
  ],
};
