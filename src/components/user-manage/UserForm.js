import React, { forwardRef, useEffect, useState } from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
  const [isRegionDisabled, setIsRegionDisabled] = useState(false);

  useEffect(() => {
    setIsRegionDisabled(props.isUpdateRegionDisabled);
  }, [props.isUpdateRegionDisabled]);

  return (
    <div>
      <Form layout="vertical" ref={ref}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
          ]}
        >
          <Input type="text" placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
          ]}
        >
          <Input type="password" placeholder="请输入密码" />
        </Form.Item>
        <Form.Item
          name="region"
          label="区域"
          rules={
            isRegionDisabled
              ? []
              : [
                  {
                    required: true,
                    message: "请选择区域",
                  },
                ]
          }
        >
          <Select
            style={{ width: "100%" }}
            placeholder="请选择区域"
            disabled={isRegionDisabled}
          >
            {props.regionList.map((region) => {
              return (
                <Option key={region.id} value={region.value}>
                  {region.title}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="roleId"
          label="角色"
          rules={[
            {
              required: true,
              message: "请选择角色",
            },
          ]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="请选择角色"
            onChange={(value) => {
              if (value === 1) {
                setIsRegionDisabled(true);
                ref.current.setFieldsValue({
                  region: "",
                });
              } else {
                setIsRegionDisabled(false);
              }
            }}
          >
            {props.roleList.map((role) => {
              return (
                <Option key={role.id} value={role.id}>
                  {role.roleName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
});

export default UserForm;
