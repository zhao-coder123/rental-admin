import { getToken } from '@/services/auth';

export default function access(initialState: any) {
  const { currentUser } = initialState || {};
  const token = getToken();

  return {
    // 是否已登录
    canAccess: !!(token && currentUser),
    // 是否是管理员
    isAdmin: currentUser?.role === 'admin',
    // 是否是业务员
    isAgent: currentUser?.role === 'agent',
    // 用户信息
    currentUser,
  };
}
