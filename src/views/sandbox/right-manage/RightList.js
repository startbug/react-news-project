import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Modal, Popover, Switch } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;
export default function RightList() {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setDataSource(
        res.data.map((s) => {
          if (!s.children) {
            return s;
          }
          if (s.children.length === 0) {
            s.children = null;
          }
          return s;
        })
      );
    });
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => <Tag color="success">{key}</Tag>,
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Popover
            content={
              <div style={{ textAlign: "center" }}>
                <Switch
                  checked={item.pagepermisson === 1}
                  onChange={() => switchMethod(item)}
                ></Switch>
              </div>
            }
            title="Title"
            trigger={item.pagepermisson === undefined ? "" : "click"}
          >
            <Button
              type="primary"
              disabled={item.pagepermisson === undefined}
              shape="circle"
              icon={<EditOutlined />}
            />
          </Popover>
          <Button
            type="danger"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => confirmMethod(item)}
          />
        </div>
      ),
    },
  ];

  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource]);

    //patch请求，补丁更新，更新指定的只读，其他字段不变
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };

  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除吗?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item);
      },
      onCancel() {
      },
    });
  };

  const deleteMethod = (item) => {
    if (item.grade === 1) {
      axios.delete(`/rights/${item.id}`);
      setDataSource(dataSource.filter((s) => s.id !== item.id));
    } else {
      let parentNode = dataSource.filter((s) => s.id === item.rightId);
      axios.delete(`/children/${item.id}`);
      parentNode[0].children = parentNode[0].children.filter(
        (s) => s.id !== item.id
      );
      setDataSource([...dataSource]);
    }
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
}
