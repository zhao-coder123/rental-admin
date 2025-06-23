import { houseAPI, uploadAPI } from '@/services/api';
import type { House } from '@/types';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  PageContainer,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, Card, message, Space, Tag, Upload } from 'antd';
import React, { useState } from 'react';

const AddHouse: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  // 基础设施选项
  const facilitiesOptions = [
    '空调',
    '洗衣机',
    '冰箱',
    '热水器',
    '燃气灶',
    '微波炉',
    '电视',
    'WiFi',
    '床',
    '衣柜',
    '书桌',
    '沙发',
    '餐桌',
    '阳台',
    '停车位',
  ];

  // 处理图片上传
  const handleImageUpload = async (file: File) => {
    try {
      const response = await uploadAPI.uploadImage(file);
      if (response.success) {
        setImageList((prev) => [...prev, response.data.url]);
        message.success('图片上传成功');
      }
    } catch (error) {
      message.error('图片上传失败');
    }
    return false; // 阻止默认上传行为
  };

  // 删除图片
  const removeImage = (index: number) => {
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  // 添加设施
  const addFacility = (facility: string) => {
    if (!selectedFacilities.includes(facility)) {
      setSelectedFacilities((prev) => [...prev, facility]);
    }
  };

  // 移除设施
  const removeFacility = (facility: string) => {
    setSelectedFacilities((prev) => prev.filter((f) => f !== facility));
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    if (imageList.length === 0) {
      message.warning('请至少上传一张房源图片');
      return;
    }

    if (selectedFacilities.length === 0) {
      message.warning('请至少选择一项基础设施');
      return;
    }

    setLoading(true);
    try {
      const houseData: Partial<House> = {
        ...values,
        images: imageList,
        facilities: selectedFacilities,
        status: 'available' as const,
      };

      await houseAPI.createHouse(houseData);
      message.success('房源添加成功');
      history.push('/houses/list');
    } catch (error) {
      message.error('房源添加失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      header={{
        title: '添加房源',
        subTitle: '请按照步骤填写房源信息',
        breadcrumb: {},
        extra: [
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.back()}
            style={{ borderRadius: 6 }}
          >
            返回
          </Button>,
        ],
      }}
      style={{ background: '#f5f7fa' }}
    >
      <Card
        style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <ProForm
          onFinish={handleSubmit}
          layout="vertical"
          submitter={{
            searchConfig: {
              submitText: '保存房源',
            },
            render: (_, dom) => (
              <div style={{ textAlign: 'center', marginTop: 32 }}>{dom}</div>
            ),
            submitButtonProps: {
              loading,
              size: 'large',
              type: 'primary',
            },
            resetButtonProps: {
              size: 'large',
            },
          }}
        >
          {/* 基础信息 */}
          <Card title="基础信息" style={{ marginBottom: 24 }}>
            <ProFormText
              name="address"
              label="房源地址"
              placeholder="请输入详细地址"
              rules={[
                { required: true, message: '请输入房源地址' },
                { min: 5, message: '地址长度不能少于5个字符' },
              ]}
              fieldProps={{
                size: 'large',
              }}
            />

            <Space size="large" style={{ width: '100%', display: 'flex' }}>
              <ProFormSelect
                name="houseType"
                label="户型"
                placeholder="请选择户型"
                options={[
                  { label: '1室1厅', value: '1室1厅' },
                  { label: '2室1厅', value: '2室1厅' },
                  { label: '2室2厅', value: '2室2厅' },
                  { label: '3室1厅', value: '3室1厅' },
                  { label: '3室2厅', value: '3室2厅' },
                  { label: '4室2厅', value: '4室2厅' },
                ]}
                rules={[{ required: true, message: '请选择户型' }]}
                fieldProps={{
                  size: 'large',
                }}
                width="md"
              />

              <ProFormDigit
                name="area"
                label="面积(㎡)"
                placeholder="请输入面积"
                rules={[
                  { required: true, message: '请输入面积' },
                  { type: 'number', min: 10, message: '面积不能小于10㎡' },
                ]}
                fieldProps={{
                  size: 'large',
                  precision: 1,
                  min: 10,
                  max: 1000,
                }}
                width="md"
              />

              <ProFormDigit
                name="rent"
                label="租金(元/月)"
                placeholder="请输入月租金"
                rules={[
                  { required: true, message: '请输入租金' },
                  { type: 'number', min: 100, message: '租金不能小于100元' },
                ]}
                fieldProps={{
                  size: 'large',
                  precision: 0,
                  min: 100,
                  max: 50000,
                  formatter: (value) =>
                    `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                  parser: (value) => Number(value!.replace(/¥\s?|(,*)/g, '')),
                }}
                width="md"
              />
            </Space>

            <ProFormTextArea
              name="description"
              label="房源描述"
              placeholder="请简单描述房源特色、周边环境等..."
              fieldProps={{
                size: 'large',
                rows: 4,
                maxLength: 500,
                showCount: true,
              }}
            />
          </Card>

          {/* 房源图片 */}
          <Card title="房源图片" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <Upload
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<PlusOutlined />} size="large">
                  上传图片
                </Button>
              </Upload>
              <span style={{ marginLeft: 16, color: '#666' }}>
                建议上传3-5张图片，支持jpg、png格式
              </span>
            </div>

            {imageList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {imageList.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      width: 120,
                      height: 90,
                      border: '1px solid #d9d9d9',
                      borderRadius: 8,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={url}
                      alt={`房源图片${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        minWidth: 'auto',
                        padding: '0 4px',
                      }}
                      onClick={() => removeImage(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* 基础设施 */}
          <Card title="基础设施">
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: '#666' }}>
                点击选择房源包含的基础设施：
              </span>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Space wrap>
                {facilitiesOptions.map((facility) => (
                  <Tag
                    key={facility}
                    style={{
                      cursor: 'pointer',
                      padding: '4px 12px',
                      fontSize: '14px',
                      border: selectedFacilities.includes(facility)
                        ? '1px solid #1890ff'
                        : '1px solid #d9d9d9',
                      backgroundColor: selectedFacilities.includes(facility)
                        ? '#e6f7ff'
                        : '#fafafa',
                      color: selectedFacilities.includes(facility)
                        ? '#1890ff'
                        : '#666',
                    }}
                    onClick={() => {
                      if (selectedFacilities.includes(facility)) {
                        removeFacility(facility);
                      } else {
                        addFacility(facility);
                      }
                    }}
                  >
                    {facility}
                  </Tag>
                ))}
              </Space>
            </div>

            {selectedFacilities.length > 0 && (
              <div>
                <div style={{ marginBottom: 8, color: '#666' }}>
                  已选择的设施：
                </div>
                <Space wrap>
                  {selectedFacilities.map((facility) => (
                    <Tag
                      key={facility}
                      closable
                      onClose={() => removeFacility(facility)}
                      color="blue"
                    >
                      {facility}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </Card>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default AddHouse;
