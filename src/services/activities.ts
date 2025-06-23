import { request } from '@umijs/max';

// 活动记录类型
export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'agent';
  action: ActivityAction;
  target: string;
  targetId?: string;
  description: string;
  metadata?: Record<string, any>;
  createTime: string;
}

// 活动类型
export type ActivityAction =
  | 'LOGIN' // 用户登录
  | 'LOGOUT' // 用户退出
  | 'CREATE_HOUSE' // 创建房源
  | 'UPDATE_HOUSE' // 更新房源
  | 'DELETE_HOUSE' // 删除房源
  | 'CREATE_TENANT' // 创建租客
  | 'UPDATE_TENANT' // 更新租客
  | 'DELETE_TENANT' // 删除租客
  | 'CREATE_CONTRACT' // 创建合同
  | 'UPDATE_CONTRACT' // 更新合同
  | 'DELETE_CONTRACT' // 删除合同
  | 'SIGN_CONTRACT' // 签署合同
  | 'CREATE_CONSULTATION' // 创建咨询
  | 'UPDATE_CONSULTATION' // 更新咨询
  | 'CREATE_APPOINTMENT' // 创建预约
  | 'UPDATE_APPOINTMENT' // 更新预约
  | 'CANCEL_APPOINTMENT' // 取消预约
  | 'UPDATE_PROFILE' // 更新个人信息
  | 'CHANGE_PASSWORD' // 修改密码
  | 'EXPORT_DATA' // 导出数据
  | 'IMPORT_DATA'; // 导入数据

// 创建活动记录DTO
export interface CreateActivityDto {
  userId: string;
  userName: string;
  userRole: 'admin' | 'agent';
  action: ActivityAction;
  target: string;
  targetId?: string;
  description: string;
  metadata?: Record<string, any>;
}

// 活动查询参数
export interface ActivityQueryParams {
  current?: number;
  pageSize?: number;
  keyword?: string;
  userId?: string;
  userRole?: 'admin' | 'agent';
  action?: ActivityAction;
  target?: string;
  startDate?: string;
  endDate?: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  code: number;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  list: T[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
}

// 活动统计类型
export interface ActivityStats {
  totalActivities: number;
  todayActivities: number;
  weekActivities: number;
  monthActivities: number;
  topUsers: Array<{ userId: string; userName: string; count: number }>;
  topActions: Array<{ action: string; count: number }>;
}

// 活动类型映射
export const activityActionMap: Record<
  ActivityAction,
  { label: string; color: string; icon: string }
> = {
  LOGIN: { label: '登录系统', color: 'blue', icon: 'LoginOutlined' },
  LOGOUT: { label: '退出系统', color: 'gray', icon: 'LogoutOutlined' },
  CREATE_HOUSE: { label: '创建房源', color: 'green', icon: 'HomeOutlined' },
  UPDATE_HOUSE: { label: '更新房源', color: 'orange', icon: 'EditOutlined' },
  DELETE_HOUSE: { label: '删除房源', color: 'red', icon: 'DeleteOutlined' },
  CREATE_TENANT: { label: '新增租客', color: 'green', icon: 'UserAddOutlined' },
  UPDATE_TENANT: { label: '更新租客', color: 'orange', icon: 'UserOutlined' },
  DELETE_TENANT: {
    label: '删除租客',
    color: 'red',
    icon: 'UserDeleteOutlined',
  },
  CREATE_CONTRACT: {
    label: '创建合同',
    color: 'green',
    icon: 'FileAddOutlined',
  },
  UPDATE_CONTRACT: {
    label: '更新合同',
    color: 'orange',
    icon: 'FileTextOutlined',
  },
  DELETE_CONTRACT: { label: '删除合同', color: 'red', icon: 'DeleteOutlined' },
  SIGN_CONTRACT: {
    label: '签署合同',
    color: 'purple',
    icon: 'CheckCircleOutlined',
  },
  CREATE_CONSULTATION: {
    label: '新增咨询',
    color: 'green',
    icon: 'MessageOutlined',
  },
  UPDATE_CONSULTATION: {
    label: '更新咨询',
    color: 'orange',
    icon: 'EditOutlined',
  },
  CREATE_APPOINTMENT: {
    label: '创建预约',
    color: 'green',
    icon: 'CalendarOutlined',
  },
  UPDATE_APPOINTMENT: {
    label: '更新预约',
    color: 'orange',
    icon: 'EditOutlined',
  },
  CANCEL_APPOINTMENT: {
    label: '取消预约',
    color: 'red',
    icon: 'CloseCircleOutlined',
  },
  UPDATE_PROFILE: { label: '更新资料', color: 'blue', icon: 'ProfileOutlined' },
  CHANGE_PASSWORD: { label: '修改密码', color: 'orange', icon: 'LockOutlined' },
  EXPORT_DATA: { label: '导出数据', color: 'purple', icon: 'ExportOutlined' },
  IMPORT_DATA: { label: '导入数据', color: 'purple', icon: 'ImportOutlined' },
};

// API服务函数

// 记录活动
export async function logActivity(
  data: CreateActivityDto,
): Promise<ApiResponse<Activity>> {
  return request('/api/activities', {
    method: 'POST',
    data,
  });
}

// 获取活动列表（分页）
export async function getActivities(
  params: ActivityQueryParams,
): Promise<ApiResponse<PaginatedResponse<Activity>>> {
  return request('/api/activities', {
    method: 'GET',
    params,
  });
}

// 获取最近活动
export async function getRecentActivities(
  limit?: number,
): Promise<ApiResponse<Activity[]>> {
  return request('/api/activities/recent', {
    method: 'GET',
    params: { limit },
  });
}

// 获取个人最近活动
export async function getMyRecentActivities(
  limit?: number,
): Promise<ApiResponse<Activity[]>> {
  return request('/api/activities/my-recent', {
    method: 'GET',
    params: { limit },
  });
}

// 获取活动统计
export async function getActivityStats(): Promise<ApiResponse<ActivityStats>> {
  return request('/api/activities/stats', {
    method: 'GET',
  });
}

// 清理旧活动记录
export async function cleanupOldActivities(
  daysToKeep: number = 90,
): Promise<ApiResponse<{ removedCount: number }>> {
  return request('/api/activities/cleanup', {
    method: 'POST',
    data: { daysToKeep },
  });
}

// 辅助函数

// 格式化活动时间
export function formatActivityTime(createTime: string): string {
  const now = new Date();
  const time = new Date(createTime);
  const diff = now.getTime() - time.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return time.toLocaleDateString();
  }
}

// 获取活动类型信息
export function getActivityTypeInfo(action: ActivityAction) {
  return (
    activityActionMap[action] || {
      label: action,
      color: 'default',
      icon: 'QuestionOutlined',
    }
  );
}
