import { request } from '@umijs/max';

export interface House {
  id: string;
  address: string;
  area: number;
  rent: number;
  houseType: string;
  facilities: string[];
  images: string[];
  status: 'available' | 'reserved' | 'rented';
  description?: string;
  createTime: string;
  updateTime: string;
}

export interface QueryParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
}

export interface CreateHouseDto {
  address: string;
  area: number;
  rent: number;
  houseType: string;
  facilities?: string[];
  images?: string[];
  description?: string;
}

export interface UpdateHouseDto {
  address?: string;
  area?: number;
  rent?: number;
  houseType?: string;
  facilities?: string[];
  images?: string[];
  description?: string;
}

// 获取房源列表
export async function getHouses(params?: QueryParams) {
  return request('/api/houses', {
    method: 'GET',
    params,
  });
}

// 获取房源详情
export async function getHouse(id: string) {
  return request(`/api/houses/${id}`, {
    method: 'GET',
  });
}

// 创建房源
export async function createHouse(data: CreateHouseDto) {
  return request('/api/houses', {
    method: 'POST',
    data,
  });
}

// 更新房源
export async function updateHouse(id: string, data: UpdateHouseDto) {
  return request(`/api/houses/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除房源
export async function deleteHouse(id: string) {
  return request(`/api/houses/${id}`, {
    method: 'DELETE',
  });
}

// 更新房源状态
export async function updateHouseStatus(
  id: string,
  status: 'available' | 'reserved' | 'rented',
) {
  return request(`/api/houses/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}
