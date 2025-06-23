import { request } from '@umijs/max';

export interface Consultation {
  id: string;
  tenantId: string;
  tenantName: string;
  content: string;
  contactType: 'phone' | 'wechat' | 'visit';
  followUpTime: string;
  nextFollowUp?: string;
  status: 'pending' | 'processing' | 'completed';
  createTime: string;
}

export interface QueryParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  tenantId?: string;
}

export interface CreateConsultationDto {
  tenantId: string;
  tenantName: string;
  content: string;
  contactType: 'phone' | 'wechat' | 'visit';
  followUpTime?: string;
  nextFollowUp?: string;
}

export interface UpdateConsultationDto {
  content?: string;
  contactType?: 'phone' | 'wechat' | 'visit';
  followUpTime?: string;
  nextFollowUp?: string;
  status?: 'pending' | 'processing' | 'completed';
}

// 获取咨询列表
export async function getConsultations(params?: QueryParams) {
  return request('/api/consultations', {
    method: 'GET',
    params,
  });
}

// 创建咨询记录
export async function createConsultation(data: CreateConsultationDto) {
  return request('/api/consultations', {
    method: 'POST',
    data,
  });
}

// 更新咨询记录
export async function updateConsultation(
  id: string,
  data: UpdateConsultationDto,
) {
  return request(`/api/consultations/${id}`, {
    method: 'PUT',
    data,
  });
}
