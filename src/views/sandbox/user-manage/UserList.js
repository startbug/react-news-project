import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Table, Switch, Button, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";

const { confirm } = Modal;
export default function UserList() {
  const [dataSource, setDataSource] = useState([]);
  const [isAddVisiable, setAddVisiable] = useState(false);
  const [isUpdateVisiable, setUpdateVisiable] = useState(false);
  const [regionList, setRegionList] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [isUpdateRegionDisabled, setIsUpdateRegionDisabled] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  const addForm = useRef(null);

  const updateForm = useRef(null);

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      render: (region) => {
        return <b>{region === "" ? "全球" : region}</b>;
      },
      filters: [
        ...regionList.map((region) => {
          return {
            text: region.title,
            value: region.value,
          };
        }),
        {
          text: "全球",
          value: "全球",
        },
      ],
      onFilter: (value, record) => {
        if (value === "全球") {
          return record.region === "";
        } else {
          return record.region === value;
        }
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return <span>{role?.roleName}</span>;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",
      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            onChange={() => handleChange(item)}
            disabled={item.default}
          />
        );
      },
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
              disabled={item.default}
              onClick={() => {
                handleUpdate(item);
              }}
            />
            <Button
              type="danger"
              shape="circle"
              icon={<DeleteOutlined />}
              disabled={item.default}
              onClick={() => confirmMethod(item)}
            />
          </div>
        );
      },
    },
  ];

  const handleUpdate = (item) => {
    // setCurrentRecord(item);
    setTimeout(() => {
      setUpdateVisiable(true);
      if (item.roleId === 1) {
        // 禁用
        setIsUpdateRegionDisabled(true);
      } else {
        // 取消禁用
        setIsUpdateRegionDisabled(false);
      }
      updateForm.current.setFieldsValue(item);
    }, 0);
    setCurrentData(item);
  };

  const handleChange = (item) => {
    console.log(item);
    axios.patch(`/users/${item.id}`, {
      roleState: !item.roleState,
    });
    setDataSource(
      dataSource.map((data) => {
        if (data.id === item.id) {
          return {
            ...data,
            roleState: !item.roleState,
          };
        }
        return data;
      })
    );
  };

  const confirmMethod = (item) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: "你确定要删除吗?",
      onOk() {
        console.log("OK");
        deleteMethod(item);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const deleteMethod = (item) => {
    console.log(item);
    axios.delete(`/users/${item.id}`);
    setDataSource(
      dataSource.filter((data) => {
        return data.id !== item.id;
      })
    );
  };

  const addFormOk = () => {
    addForm.current
      .validateFields()
      .then((values) => {
        console.log(values);
        axios
          .post("/users", {
            ...values,
            roleState: true,
            default: false,
          })
          .then((res) => {
            addForm.current.resetFields();
            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((role) => role.id === res.data.roleId)[0],
              },
            ]);
          });
        setAddVisiable(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateFormOk = () => {
    updateForm.current
      .validateFields()
      .then((values) => {
        console.log(values);
        axios
          .patch(`/users/${currentData.id}`, values)
          .then((res) => {
            updateForm.current.resetFields();
            setDataSource(
              dataSource.map((data) => {
                if (data.id === currentData.id) {
                  return {
                    ...currentData,
                    ...values,
                    role: roleList.filter(
                      (role) => role.id === values.roleId
                    )[0],
                  };
                }
                return data;
              })
            );
          });
        setUpdateVisiable(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("token"));
    axios.get("/regions").then((res) => {
      setRegionList(res.data);
    });

    axios.get("/roles").then((res) => {
      setRoleList(res.data);
    });

    axios.get("/users?_expand=role").then((res) => {
      setDataSource(
        user.roleId === 1
          ? res.data
          : [
              ...res.data.filter((u) => u.id === user.id),
              ...res.data.filter(
                (u) => u.region === user.region && u.roleId > user.roleId
              ),
            ]
      );
    });
  }, []);

  return (
    <div>
      <Button type="primary" onClick={() => setAddVisiable(true)}>
        添加用户
      </Button>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      />
      <Modal
        visible={isAddVisiable}
        title={"添加用户"}
        okText="确定"
        cancelText="取消"
        onCancel={() => {
          setAddVisiable(false);
        }}
        onOk={() => {
          addFormOk();
        }}
      >
        <UserForm ref={addForm} regionList={regionList} roleList={roleList} />
      </Modal>

      <Modal
        visible={isUpdateVisiable}
        title={"修改用户"}
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateRegionDisabled(!isUpdateRegionDisabled);
          setUpdateVisiable(false);
        }}
        onOk={() => {
          updateFormOk();
        }}
      >
        <UserForm
          ref={updateForm}
          regionList={regionList}
          roleList={roleList}
          isUpdateRegionDisabled={isUpdateRegionDisabled}
          isUpdate={true}
        />
      </Modal>
    </div>
  );
}
