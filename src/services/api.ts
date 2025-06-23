import type {
  ApiResponse,
  Appointment,
  Consultation,
  House,
  PaginatedResponse,
  PerformanceStats,
  QueryParams,
  Tenant,
} from '@/types';
import { request } from '@umijs/max';

// 房源管理API
export const houseAPI = {
  // 获取房源列表
  getHouseList: (
    params: QueryParams,
  ): Promise<ApiResponse<PaginatedResponse<House>>> => {
    return request('/api/houses', {
      method: 'GET',
      params,
    });
  },

  // 获取房源详情
  getHouseDetail: (id: string): Promise<ApiResponse<House>> => {
    return request(`/api/houses/${id}`, {
      method: 'GET',
    });
  },

  // 创建房源
  createHouse: (data: Partial<House>): Promise<ApiResponse<House>> => {
    return request('/api/houses', {
      method: 'POST',
      data,
    });
  },

  // 更新房源
  updateHouse: (
    id: string,
    data: Partial<House>,
  ): Promise<ApiResponse<House>> => {
    return request(`/api/houses/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除房源
  deleteHouse: (id: string): Promise<ApiResponse<void>> => {
    return request(`/api/houses/${id}`, {
      method: 'DELETE',
    });
  },

  // 更新房源状态
  updateHouseStatus: (
    id: string,
    status: House['status'],
  ): Promise<ApiResponse<House>> => {
    return request(`/api/houses/${id}/status`, {
      method: 'PUT',
      data: { status },
    });
  },
};

// 租客管理API
export const tenantAPI = {
  // 获取租客列表
  getTenantList: (
    params: QueryParams,
  ): Promise<ApiResponse<PaginatedResponse<Tenant>>> => {
    return request('/api/tenants', {
      method: 'GET',
      params,
    });
  },

  // 获取租客详情
  getTenantDetail: (id: string): Promise<ApiResponse<Tenant>> => {
    return request(`/api/tenants/${id}`, {
      method: 'GET',
    });
  },

  // 创建租客
  createTenant: (data: Partial<Tenant>): Promise<ApiResponse<Tenant>> => {
    return request('/api/tenants', {
      method: 'POST',
      data,
    });
  },

  // 更新租客
  updateTenant: (
    id: string,
    data: Partial<Tenant>,
  ): Promise<ApiResponse<Tenant>> => {
    return request(`/api/tenants/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除租客
  deleteTenant: (id: string): Promise<ApiResponse<void>> => {
    return request(`/api/tenants/${id}`, {
      method: 'DELETE',
    });
  },
};

// 咨询管理API
export const consultationAPI = {
  // 获取咨询列表
  getConsultationList: (
    params: QueryParams,
  ): Promise<ApiResponse<PaginatedResponse<Consultation>>> => {
    return request('/api/consultations', {
      method: 'GET',
      params,
    });
  },

  // 创建咨询记录
  createConsultation: (
    data: Partial<Consultation>,
  ): Promise<ApiResponse<Consultation>> => {
    return request('/api/consultations', {
      method: 'POST',
      data,
    });
  },

  // 更新咨询记录
  updateConsultation: (
    id: string,
    data: Partial<Consultation>,
  ): Promise<ApiResponse<Consultation>> => {
    return request(`/api/consultations/${id}`, {
      method: 'PUT',
      data,
    });
  },
};

// 预约管理API
export const appointmentAPI = {
  // 获取预约列表
  getAppointmentList: (
    params: QueryParams,
  ): Promise<ApiResponse<PaginatedResponse<Appointment>>> => {
    return request('/api/appointments', {
      method: 'GET',
      params,
    });
  },

  // 创建预约
  createAppointment: (
    data: Partial<Appointment>,
  ): Promise<ApiResponse<Appointment>> => {
    return request('/api/appointments', {
      method: 'POST',
      data,
    });
  },

  // 获取预约详情
  getAppointmentDetail: (id: string): Promise<ApiResponse<Appointment>> => {
    return request(`/api/appointments/${id}`, {
      method: 'GET',
    });
  },

  // 更新预约
  updateAppointment: (
    id: string,
    data: Partial<Appointment>,
  ): Promise<ApiResponse<Appointment>> => {
    return request(`/api/appointments/${id}`, {
      method: 'PUT',
      data,
    });
  },

  // 删除预约
  deleteAppointment: (id: string): Promise<ApiResponse<void>> => {
    return request(`/api/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  // 更新预约状态
  updateAppointmentStatus: (
    id: string,
    status: Appointment['status'],
  ): Promise<ApiResponse<Appointment>> => {
    return request(`/api/appointments/${id}/status`, {
      method: 'PUT',
      data: { status },
    });
  },
};

// 统计API
export const statsAPI = {
  // 获取仪表盘统计
  getDashboardStats: (): Promise<ApiResponse<any>> => {
    return request('/api/stats/dashboard', {
      method: 'GET',
    });
  },

  // 获取业绩统计
  getPerformanceStats: (params?: {
    year?: string;
    month?: string;
  }): Promise<ApiResponse<PerformanceStats>> => {
    return request('/api/stats/performance', {
      method: 'GET',
      params,
    });
  },

  // 获取房源统计
  getHouseStats: (): Promise<ApiResponse<any>> => {
    return request('/api/stats/houses', {
      method: 'GET',
    });
  },

  // 获取租客统计
  getTenantStats: (): Promise<ApiResponse<any>> => {
    return request('/api/stats/tenants', {
      method: 'GET',
    });
  },
};

// 文件上传API
export const uploadAPI = {
  // 上传图片
  uploadImage: (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/api/upload/image', {
      method: 'POST',
      data: formData,
    });
  },
};
