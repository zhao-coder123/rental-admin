import {
  contractStatusOptions,
  createContract,
  deleteContract,
  getContractList,
  paymentMethodOptions,
  updateContract,
  updateContractStatus,
  type ContractListParams,
  type CreateContractDto,
} from '@/services/contracts';
import { getHouses } from '@/services/houses';
import { getTenants } from '@/services/tenants';
import type { Contract } from '@/types';
import {
  CalendarOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useNavigate } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useEffect, useState } from 'react';

const { Search } = Input;
const { Option } = Select;

export default function ContractList() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 搜索和筛选
  const [searchParams, setSearchParams] = useState<ContractListParams>({});

  // 统计数据
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    draft: 0,
  });

  // 弹窗状态
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  // 辅助数据
  const [tenants, setTenants] = useState<any[]>([]);
  const [houses, setHouses] = useState<any[]>([]);

  // 获取合同列表
  const fetchContracts = async (params?: ContractListParams) => {
    setLoading(true);
    try {
      const response = await getContractList({
        current,
        pageSize,
        ...searchParams,
        ...params,
      });

      if (response.success) {
        // 适配后端返回的PaginatedResponse格式
        const contractData = response.data.list || [];
        const pagination = response.data.pagination || {};

        setContracts(contractData);
        setTotal(pagination.total || 0);

        // 计算统计数据
        setStats({
          total: contractData.length,
          active: contractData.filter((c: Contract) => c.status === 'active')
            .length,
          expired: contractData.filter((c: Contract) => c.status === 'expired')
            .length,
          draft: contractData.filter((c: Contract) => c.status === 'draft')
            .length,
        });
      }
    } catch (error) {
      message.error('获取合同列表失败');
    }
    setLoading(false);
  };

  // 获取租客和房源列表
  const fetchAuxiliaryData = async () => {
    try {
      const [tenantsRes, housesRes] = await Promise.all([
        getTenants({ pageSize: 1000 }),
        getHouses({ pageSize: 1000 }),
      ]);

      if (tenantsRes.success) {
        // 适配分页响应格式
        setTenants(tenantsRes.data?.list || tenantsRes.data?.data || []);
      }

      if (housesRes.success) {
        // 适配分页响应格式
        setHouses(housesRes.data?.list || housesRes.data?.data || []);
      }
    } catch (error) {
      console.error('获取辅助数据失败', error);
    }
  };

  useEffect(() => {
    fetchContracts();
    fetchAuxiliaryData();
  }, [current, pageSize]);

  // 搜索
  const handleSearch = (keyword?: string) => {
    const newParams = { ...searchParams, keyword };
    setSearchParams(newParams);
    setCurrent(1);
    fetchContracts(newParams);
  };

  // 状态筛选
  const handleStatusFilter = (status?: string) => {
    const newParams = { ...searchParams, status };
    setSearchParams(newParams);
    setCurrent(1);
    fetchContracts(newParams);
  };

  // 删除合同
  const handleDelete = async (id: string) => {
    try {
      const response = await deleteContract(id);
      if (response.success) {
        message.success('删除成功');
        fetchContracts();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 更新合同状态
  const handleStatusUpdate = async (id: string, status: Contract['status']) => {
    try {
      const response = await updateContractStatus(id, status);
      if (response.success) {
        message.success('状态更新成功');
        fetchContracts();
      }
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 打开编辑抽屉
  const handleEdit = (record: Contract) => {
    setEditingContract(record);
    setDrawerVisible(true);
    form.setFieldsValue({
      ...record,
      startDate: record.startDate ? moment(record.startDate) : null,
      endDate: record.endDate ? moment(record.endDate) : null,
    });
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        startDate: values.startDate?.format('YYYY-MM-DD'),
        endDate: values.endDate?.format('YYYY-MM-DD'),
      };

      let response;
      if (editingContract) {
        response = await updateContract(editingContract.id, formData);
      } else {
        response = await createContract(formData as CreateContractDto);
      }

      if (response.success) {
        message.success(`${editingContract ? '更新' : '创建'}成功`);
        setDrawerVisible(false);
        form.resetFields();
        setEditingContract(null);
        fetchContracts();
      }
    } catch (error) {
      message.error(`${editingContract ? '更新' : '创建'}失败`);
    }
  };

  // 表格列定义
  const columns: ColumnsType<Contract> = [
    {
      title: '合同编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '房源地址',
      dataIndex: 'houseAddress',
      key: 'houseAddress',
      width: 200,
      ellipsis: true,
    },
    {
      title: '租客姓名',
      dataIndex: 'tenantName',
      key: 'tenantName',
      width: 100,
    },
    {
      title: '租金(元/月)',
      dataIndex: 'rent',
      key: 'rent',
      width: 120,
      render: (rent: number) => (
        <span style={{ color: '#f50', fontWeight: 'bold' }}>
          ¥{rent.toLocaleString()}
        </span>
      ),
    },
    {
      title: '押金(元)',
      dataIndex: 'deposit',
      key: 'deposit',
      width: 120,
      render: (deposit: number) => `¥${deposit.toLocaleString()}`,
    },
    {
      title: '合同期限',
      key: 'period',
      width: 200,
      render: (record: Contract) => (
        <div>
          <div>{record.startDate}</div>
          <div style={{ color: '#666' }}>至 {record.endDate}</div>
        </div>
      ),
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 100,
      render: (method: string) => {
        const option = paymentMethodOptions.find((opt) => opt.value === method);
        return option?.label || method;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const option = contractStatusOptions.find(
          (opt) => opt.value === status,
        );
        return (
          <Tag color={option?.color || 'default'}>
            {option?.label || status}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      render: (time: string) => new Date(time).toLocaleDateString(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (record: Contract) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/contracts/detail/${record.id}`)}
          >
            详情
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.status === 'draft' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleStatusUpdate(record.id, 'signed')}
            >
              签署
            </Button>
          )}
          <Popconfirm
            title="确定要删除这个合同吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      title="合同管理"
      breadcrumb={{
        routes: [
          { path: '/', breadcrumbName: '首页' },
          { path: '/contracts', breadcrumbName: '合同管理' },
          { path: '/contracts/list', breadcrumbName: '合同列表' },
        ],
      }}
    >
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总合同数"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="生效中"
              value={stats.active}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="草稿"
              value={stats.draft}
              prefix={<EditOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已到期"
              value={stats.expired}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* 搜索和筛选 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Search
              placeholder="搜索房源地址或租客姓名"
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="选择状态"
              allowClear
              style={{ width: '100%' }}
              onChange={handleStatusFilter}
            >
              {contractStatusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={10}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setDrawerVisible(true)}
              >
                新建合同
              </Button>
              <Button onClick={() => fetchContracts()}>刷新</Button>
            </Space>
          </Col>
        </Row>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={contracts}
          rowKey="id"
          loading={loading}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size || 10);
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 编辑/新建抽屉 */}
      <Drawer
        title={editingContract ? '编辑合同' : '新建合同'}
        width={600}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setEditingContract(null);
          form.resetFields();
        }}
        extra={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>取消</Button>
            <Button type="primary" onClick={() => form.submit()}>
              保存
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="houseId"
            label="选择房源"
            rules={[{ required: true, message: '请选择房源' }]}
          >
            <Select
              placeholder="选择房源"
              showSearch
              filterOption={(input, option) =>
                (option?.children as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value, option: any) => {
                form.setFieldValue('houseAddress', option?.children);
              }}
            >
              {houses.map((house) => (
                <Option key={house.id} value={house.id}>
                  {house.address}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="houseAddress" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Form.Item
            name="tenantId"
            label="选择租客"
            rules={[{ required: true, message: '请选择租客' }]}
          >
            <Select
              placeholder="选择租客"
              showSearch
              filterOption={(input, option) =>
                (option?.children as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value, option: any) => {
                form.setFieldValue('tenantName', option?.children);
              }}
            >
              {tenants.map((tenant) => (
                <Option key={tenant.id} value={tenant.id}>
                  {tenant.name} - {tenant.phone}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="tenantName" style={{ display: 'none' }}>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rent"
                label="月租金(元)"
                rules={[{ required: true, message: '请输入月租金' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入月租金"
                  formatter={(value) =>
                    `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deposit"
                label="押金(元)"
                rules={[{ required: true, message: '请输入押金' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  placeholder="请输入押金"
                  formatter={(value) =>
                    `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value!.replace(/¥\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="开始日期"
                rules={[{ required: true, message: '请选择开始日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="结束日期"
                rules={[{ required: true, message: '请选择结束日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="paymentMethod"
            label="支付方式"
            rules={[{ required: true, message: '请选择支付方式' }]}
          >
            <Select placeholder="选择支付方式">
              {paymentMethodOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="合同状态" initialValue="draft">
            <Select>
              {contractStatusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </PageContainer>
  );
}
