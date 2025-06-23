import {
  createUser,
  CreateUserDto,
  deleteUser,
  getUsers,
  resetPassword,
  updateUser,
  UpdateUserDto,
  updateUserStatus,
  User,
} from '@/services/users';
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Tag,
} from 'antd';
import React, { useRef, useState } from 'react';

const UsersList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 角色标签颜色
  const getRoleTag = (role: string) => {
    const colors = {
      admin: 'red',
      agent: 'blue',
    };
    const labels = {
      admin: '管理员',
      agent: '业务员',
    };
    return (
      <Tag color={colors[role as keyof typeof colors]}>
        {labels[role as keyof typeof labels]}
      </Tag>
    );
  };

  // 状态标签颜色
  const getStatusTag = (status: string) => {
    const colors = {
      active: 'green',
      inactive: 'red',
    };
    const labels = {
      active: '正常',
      inactive: '禁用',
    };
    return (
      <Tag color={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Tag>
    );
  };

  // 创建用户
  const handleCreate = async (values: CreateUserDto) => {
    try {
      await createUser(values);
      message.success('用户创建成功');
      setCreateModalVisible(false);
      createForm.resetFields();
      actionRef.current?.reload();
    } catch (error) {
      message.error('创建失败');
    }
  };

  // 更新用户
  const handleUpdate = async (values: UpdateUserDto) => {
    if (!selectedUser) return;
    try {
      await updateUser(selectedUser.id, values);
      message.success('用户更新成功');
      setEditModalVisible(false);
      editForm.resetFields();
      actionRef.current?.reload();
    } catch (error) {
      message.error('更新失败');
    }
  };

  // 删除用户
  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('用户删除成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 切换用户状态
  const handleStatusToggle = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await updateUserStatus(user.id, newStatus);
      message.success('状态更新成功');
      actionRef.current?.reload();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 重置密码
  const handleResetPassword = async (values: { password: string }) => {
    if (!selectedUser) return;
    try {
      await resetPassword(selectedUser.id, values.password);
      message.success('密码重置成功');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      message.error('密码重置失败');
    }
  };

  const columns: ProColumns<User>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      width: 120,
      sorter: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      valueType: 'select',
      valueEnum: {
        admin: { text: '管理员', status: 'Error' },
        agent: { text: '业务员', status: 'Processing' },
      },
      render: (_, record) => getRoleTag(record.role),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 130,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        active: { text: '正常', status: 'Success' },
        inactive: { text: '禁用', status: 'Error' },
      },
      render: (_, record) => getStatusTag(record.status),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      width: 180,
      search: false,
      sorter: true,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            setSelectedUser(record);
            editForm.setFieldsValue(record);
            setEditModalVisible(true);
          }}
        >
          编辑
        </Button>,
        <Button
          key="password"
          type="link"
          size="small"
          icon={<KeyOutlined />}
          onClick={() => {
            setSelectedUser(record);
            setPasswordModalVisible(true);
          }}
        >
          重置密码
        </Button>,
        <Switch
          key="status"
          size="small"
          checked={record.status === 'active'}
          onChange={() => handleStatusToggle(record)}
          disabled={record.username === 'admin'}
        />,
        <Popconfirm
          key="delete"
          title="确定要删除这个用户吗？"
          onConfirm={() => handleDelete(record.id)}
          disabled={record.username === 'admin'}
        >
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            disabled={record.username === 'admin'}
          >
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<User>
        headerTitle="用户管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setCreateModalVisible(true)}
          >
            新建用户
          </Button>,
        ]}
        request={async (params) => {
          const response = await getUsers(params);
          return {
            data: response.data.list || [],
            success: true,
            total: response.data.pagination?.total || 0,
          };
        }}
        columns={columns}
        rowSelection={false}
      />

      {/* 创建用户模态框 */}
      <Modal
        title="创建用户"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="agent">业务员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setCreateModalVisible(false);
                  createForm.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="agent">业务员</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="手机号" name="phone">
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setEditModalVisible(false);
                  editForm.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                更新
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码模态框 */}
      <Modal
        title="重置密码"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={400}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item
            label="新密码"
            name="password"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setPasswordModalVisible(false);
                  passwordForm.resetFields();
                }}
              >
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default UsersList;
