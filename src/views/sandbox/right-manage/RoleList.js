import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/roles").then((res) => {
      setDataSource(res.data);
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button type="primary" shape="circle" icon={<EditOutlined />} />
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            />
          </div>
        );
      },
    },
  ];

  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除吗?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {},
    });
  };

  const deleteMethod = (item) => {
    axios.delete(`http://localhost:8000/roles/${item.id}`);
    setDataSource(dataSource.filter((s) => s.id !== item.id));
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
