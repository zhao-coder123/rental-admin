import { request } from '@umijs/max';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  access_token: string;
  user: {
    id: string;
    username: string;
    name: string;
    role: 'admin' | 'agent';
    phone?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code: number;
}

// 用户登录
export async function login(
  params: LoginParams,
): Promise<ApiResponse<LoginResult>> {
  return request('/api/auth/login', {
    method: 'POST',
    data: params,
  });
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<
  ApiResponse<LoginResult['user']>
> {
  return request('/api/auth/me', {
    method: 'GET',
  });
}

// 更新个人信息
export async function updateProfile(profileData: {
  name?: string;
  phone?: string;
  email?: string;
}): Promise<ApiResponse<LoginResult['user']>> {
  return request('/api/auth/profile', {
    method: 'PUT',
    data: profileData,
  });
}

// 修改密码
export async function changePassword(passwordData: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<null>> {
  return request('/api/auth/password', {
    method: 'PUT',
    data: passwordData,
  });
}

// 用户登出
export async function logout(): Promise<void> {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_info');
}

// 获取存储的token
export function getToken(): string | null {
  return localStorage.getItem('access_token');
}

// 获取存储的用户信息
export function getUserInfo(): LoginResult['user'] | null {
  const userInfo = localStorage.getItem('user_info');
  if (userInfo) {
    try {
      return JSON.parse(userInfo);
    } catch (error) {
      console.error('解析用户信息失败:', error);
      return null;
    }
  }
  return null;
}

// 保存登录信息
export function saveLoginInfo(loginResult: LoginResult): void {
  localStorage.setItem('access_token', loginResult.access_token);
  localStorage.setItem('user_info', JSON.stringify(loginResult.user));
}
