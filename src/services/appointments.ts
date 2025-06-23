import { request } from '@umijs/max';

export interface Appointment {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  houseId: string;
  houseAddress: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createTime: string;
}

export interface QueryParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  tenantId?: string;
  houseId?: string;
}

export interface CreateAppointmentDto {
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  houseId: string;
  houseAddress: string;
  appointmentTime: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  tenantName?: string;
  tenantPhone?: string;
  houseAddress?: string;
  appointmentTime?: string;
  notes?: string;
}

// 获取预约列表
export async function getAppointments(params?: QueryParams) {
  return request('/api/appointments', {
    method: 'GET',
    params,
  });
}

// 获取预约详情
export async function getAppointment(id: string) {
  return request(`/api/appointments/${id}`, {
    method: 'GET',
  });
}

// 创建预约
export async function createAppointment(data: CreateAppointmentDto) {
  return request('/api/appointments', {
    method: 'POST',
    data,
  });
}

// 更新预约
export async function updateAppointment(
  id: string,
  data: UpdateAppointmentDto,
) {
  return request(`/api/appointments/${id}`, {
    method: 'PUT',
    data,
  });
}

// 删除预约
export async function deleteAppointment(id: string) {
  return request(`/api/appointments/${id}`, {
    method: 'DELETE',
  });
}

// 更新预约状态
export async function updateAppointmentStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
) {
  return request(`/api/appointments/${id}/status`, {
    method: 'PUT',
    data: { status },
  });
}
