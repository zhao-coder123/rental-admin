// 房源相关类型
export interface House {
  id: string;
  address: string;
  area: number;
  rent: number;
  houseType: string; // 户型：1室1厅、2室1厅等
  facilities: string[]; // 基础设施
  images: string[];
  status: 'available' | 'reserved' | 'rented'; // 待租、已预定、已出租
  description?: string;
  createTime: string;
  updateTime: string;
}

// 租客相关类型
export interface Tenant {
  id: string;
  name: string;
  phone: string;
  budget: number; // 预算
  preferredHouseType: string; // 偏好户型
  preferredLocation: string; // 偏好位置
  intentionLevel: 'high' | 'medium' | 'low'; // 意向等级：高、中、低
  createTime: string;
  updateTime: string;
}

// 咨询记录类型
export interface Consultation {
  id: string;
  tenantId: string;
  tenantName: string;
  content: string; // 咨询内容
  contactType: 'phone' | 'wechat' | 'visit'; // 联系方式
  followUpTime: string; // 跟进时间
  nextFollowUp?: string; // 下次跟进时间
  status: 'pending' | 'processing' | 'completed'; // 状态
  createTime: string;
}

// 预约看房类型
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

// 业绩统计类型
export interface PerformanceStats {
  monthlyDeals: number; // 本月成交数
  monthlyRevenue: number; // 本月租金总额
  vacancyRate: number; // 房源空置率
  totalHouses: number; // 总房源数
  availableHouses: number; // 可租房源数
  rentedHouses: number; // 已租房源数
  totalTenants: number; // 总租客数
  activeTenants: number; // 活跃租客数
}

// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code: number;
}

// 分页类型
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  list: T[];
  pagination: PaginationConfig;
}

// 查询参数类型
export interface QueryParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  [key: string]: any;
}
