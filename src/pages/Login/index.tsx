import { login, saveLoginInfo, type LoginParams } from '@/services/auth';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Card, Checkbox, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginParams) => {
    setLoading(true);
    try {
      const response = await login(values);

      if (response.success) {
        // 保存登录信息
        saveLoginInfo(response.data);

        message.success(response.message || '登录成功');

        // 重定向到首页
        const redirect = new URLSearchParams(window.location.search).get(
          'redirect',
        );
        history.push(redirect || '/dashboard');
      } else {
        message.error(response.message || '登录失败');
      }
    } catch (error: any) {
      console.error('登录错误:', error);
      message.error(error?.message || '网络错误，请检查后端服务是否正常运行');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <span className={styles.title}>房屋租赁中介管理系统</span>
          </div>
          <div className={styles.desc}>专业的房源管理解决方案</div>
        </div>

        <div className={styles.main}>
          <Card className={styles.loginCard}>
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={handleLogin}
              size="large"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名: admin" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码: 123456"
                />
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住我</Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.submitButton}
                  loading={loading}
                  block
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
