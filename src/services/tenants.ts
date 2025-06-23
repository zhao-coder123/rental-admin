import { request } from '@umijs/max';

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  budget: number;
  preferredHouseType: string;
  preferredLocation: string;
  intentionLevel: 'high' | 'medium' | 'low';
  createTime: string;
  updateTime: string;
}

export interface QueryParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  intentionLevel?: string;
}

export interface CreateTenantDto {
  name: string;
  phone: string;
  budget: number;
  preferredHouseType: string;
  preferredLocation: string;
  intentionLevel?: 'high' | 'medium' | 'low';
}

export interface UpdateTenantDto {
  name?: string;
  phone?: string;
  budget?: number;
  preferredHouseType?: string;
  preferredLocation?: string;
  intentionLevel?: 'high' | 'medium' | 'low';
}

// 获取租客列表
export async function getTenants(params?: QueryParams) {
  return request('/api/tenants', {
    method: 'GET',
    params,
  });
}

// 获取租客详情
export async function getTenant(id: string) {
  return request(`/api/tenants/${id}`, {
    method: 'GET',
  });
}

// 创建租客
export async function createTenant(data: CreateTenantDto) {
  return request('/api/tenants', {
    method: 'POST',
    data,
  });
}

// 更新租客
export async function updateTenant(id: string, data: UpdateTenantDto) {
  return request(`/api/tenants/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除租客
export async function deleteTenant(id: string) {
  return request(`/api/tenants/${id}`, {
    method: 'DELETE',
  });
}

// 更新租客意向等级
export async function updateTenantIntention(
  id: string,
  intentionLevel: 'high' | 'medium' | 'low',
) {
  return request(`/api/tenants/${id}/intention`, {
    method: 'PUT',
    data: { intentionLevel },
  });
}
