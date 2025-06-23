import { request } from '@umijs/max';

export interface DashboardStats {
  houses: {
    total: number;
    available: number;
    rented: number;
    reserved: number;
    vacancyRate: string;
  };
  tenants: {
    total: number;
    highIntention: number;
  };
  appointments: {
    today: number;
    monthly: number;
  };
  consultations: {
    pending: number;
    monthly: number;
  };
}

export interface PerformanceStats {
  monthlyDeals: number;
  monthlyRevenue: number;
  vacancyRate: number;
  totalHouses: number;
  availableHouses: number;
  rentedHouses: number;
  totalTenants: number;
  activeTenants: number;
}

export interface HouseStats {
  statusStats: {
    available: number;
    rented: number;
    reserved: number;
  };
  houseTypeStats: Record<string, number>;
  rentRangeStats: {
    '0-2000': number;
    '2000-4000': number;
    '4000-6000': number;
    '6000+': number;
  };
  total: number;
}

export interface TenantStats {
  intentionStats: {
    high: number;
    medium: number;
    low: number;
  };
  budgetRangeStats: {
    '0-2000': number;
    '2000-4000': number;
    '4000-6000': number;
    '6000+': number;
  };
  total: number;
}

// 获取仪表盘统计数据
export async function getDashboardStats() {
  return request('/api/stats/dashboard', {
    method: 'GET',
  });
}

// 获取业绩统计数据
export async function getPerformanceStats(params?: {
  year?: string;
  month?: string;
}) {
  return request('/api/stats/performance', {
    method: 'GET',
    params,
  });
}

// 获取房源统计数据
export async function getHouseStats() {
  return request('/api/stats/houses', {
    method: 'GET',
  });
}

// 获取租客统计数据
export async function getTenantStats() {
  return request('/api/stats/tenants', {
    method: 'GET',
  });
}
