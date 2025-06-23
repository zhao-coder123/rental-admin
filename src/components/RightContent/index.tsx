import { logout } from '@/services/auth';
import {
  CrownOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import { Avatar, Button, Dropdown, Space, message } from 'antd';
import React from 'react';

interface RightContentProps {
  currentUser?: any;
}

const RightContent: React.FC<RightContentProps> = ({ currentUser }) => {
  // 使用全局状态
  const { initialState } = useModel('@@initialState');
  const user = currentUser || initialState?.currentUser;

  // 如果没有用户信息，显示登录按钮
  if (!user) {
    return (
      <div style={{ padding: '0 16px' }}>
        <Button
          type="primary"
          size="small"
          onClick={() => history.push('/login')}
        >
          登录
        </Button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    message.success('已安全退出');
    history.push('/login');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => history.push('/user'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
      onClick: () => history.push('/user'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        padding: '0 16px',
      }}
    >
      <Dropdown
        menu={{ items: menuItems }}
        placement="bottomRight"
        arrow
        trigger={['click']}
      >
        <Space
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Avatar
            size="small"
            icon={user.role === 'admin' ? <CrownOutlined /> : <UserOutlined />}
            style={{
              backgroundColor: user.role === 'admin' ? '#f50' : '#1890ff',
            }}
          />
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            {user.name}
          </span>
        </Space>
      </Dropdown>
    </div>
  );
};

export default RightContent;
