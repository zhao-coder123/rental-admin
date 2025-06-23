import { request } from '@umijs/max';

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'agent';
  phone?: string;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

export interface QueryParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  role?: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'agent';
  phone?: string;
}

export interface UpdateUserDto {
  name?: string;
  role?: 'admin' | 'agent';
  phone?: string;
}

// 获取用户列表
export async function getUsers(params?: QueryParams) {
  return request('/api/users', {
    method: 'GET',
    params,
  });
}

// 获取用户详情
export async function getUser(id: string) {
  return request(`/api/users/${id}`, {
    method: 'GET',
  });
}

// 创建用户
export async function createUser(data: CreateUserDto) {
  return request('/api/users', {
    method: 'POST',
    data,
  });
}

// 更新用户
export async function updateUser(id: string, data: UpdateUserDto) {
  return request(`/api/users/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除用户
export async function deleteUser(id: string) {
  return request(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

// 更新用户状态
export async function updateUserStatus(
  id: string,
  status: 'active' | 'inactive',
) {
  return request(`/api/users/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}

// 重置密码
export async function resetPassword(id: string, password: string) {
  return request(`/api/users/${id}/password`, {
    method: 'PUT',
    data: { password },
  });
}
