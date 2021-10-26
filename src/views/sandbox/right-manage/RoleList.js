import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Tree } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [rightsDataSource, setRightsDataSource] = useState([]);
  const [currentCheckedKeys, setCurrentCheckedKeys] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  useEffect(() => {
    axios.get("/roles").then((res) => {
      setDataSource(res.data);
    });
    axios.get("/rights?_embed=children").then((res) => {
      setRightsDataSource(res.data);
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
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentCheckedKeys(item.rights);
                setModalVisible(true);
                setCurrentId(item.id);
              }}
            />
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
    axios.delete(`/roles/${item.id}`);
    setDataSource(dataSource.filter((s) => s.id !== item.id));
  };

  const handleOk = () => {
    console.log("点击ok");
    console.log(currentCheckedKeys);
    axios.patch(`/roles/${currentId}`, {
      rights: currentCheckedKeys,
    });
    setModalVisible(false);
    setDataSource(
      dataSource.map((data) => {
        if (data.id === currentId) {
          return {
            ...data,
            rights: currentCheckedKeys,
          };
        }
        return data;
      })
    );
  };

  const handleCancel = () => {
    console.log("点击cancel");
    setModalVisible(false);
  };

  const onCheck = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys);
    setCurrentCheckedKeys(checkedKeys.checked);
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      />

      <Modal
        title="权限配置"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkedKeys={currentCheckedKeys}
          treeData={rightsDataSource}
          checkStrictly={true}
          onCheck={onCheck}
        />
      </Modal>
    </div>
  );
}
