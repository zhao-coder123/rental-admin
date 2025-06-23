import type { Contract } from '@/types';
import { request } from '@umijs/max';

export interface ContractListParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: Contract['status'];
  tenantId?: string;
  houseId?: string;
}

export interface CreateContractDto {
  houseId: string;
  houseAddress: string;
  tenantId: string;
  tenantName: string;
  rent: number;
  deposit: number;
  startDate: string;
  endDate: string;
  paymentMethod: 'monthly' | 'quarterly' | 'annually';
  status?: Contract['status'];
}

export interface UpdateContractDto extends Partial<CreateContractDto> {
  signDate?: string;
  contractFile?: string;
}

// 获取合同列表
export async function getContractList(params?: ContractListParams) {
  return request('/api/contracts', {
    method: 'GET',
    params,
  });
}

// 获取合同详情
export async function getContractDetail(id: string) {
  return request(`/api/contracts/${id}`, {
    method: 'GET',
  });
}

// 创建合同
export async function createContract(data: CreateContractDto) {
  return request('/api/contracts', {
    method: 'POST',
    data,
  });
}

// 更新合同
export async function updateContract(id: string, data: UpdateContractDto) {
  return request(`/api/contracts/${id}`, {
    method: 'PUT',
    data,
  });
}

// 更新合同状态
export async function updateContractStatus(
  id: string,
  status: Contract['status'],
) {
  return request(`/api/contracts/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}

// 删除合同
export async function deleteContract(id: string) {
  return request(`/api/contracts/${id}`, {
    method: 'DELETE',
  });
}

// 获取租客的合同
export async function getContractsByTenant(tenantId: string) {
  return request(`/api/contracts/tenant/${tenantId}`, {
    method: 'GET',
  });
}

// 获取房源的合同
export async function getContractsByHouse(houseId: string) {
  return request(`/api/contracts/house/${houseId}`, {
    method: 'GET',
  });
}

// 合同状态选项
export const contractStatusOptions = [
  { label: '草稿', value: 'draft', color: 'default' },
  { label: '已签署', value: 'signed', color: 'processing' },
  { label: '生效中', value: 'active', color: 'success' },
  { label: '已到期', value: 'expired', color: 'warning' },
  { label: '已终止', value: 'terminated', color: 'error' },
];

// 支付方式选项
export const paymentMethodOptions = [
  { label: '月付', value: 'monthly' },
  { label: '季付', value: 'quarterly' },
  { label: '年付', value: 'annually' },
];
