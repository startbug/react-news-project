import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Table, Modal } from "antd";

const { confirm } = Modal;
export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([]);

  const { username } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        console.log(res.data);
        setDataSource(res.data);
      });
  }, [username]);

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
    axios.delete(`/news/${item.id}`).then((res) => {
      setDataSource(dataSource.filter((data) => item.id !== data.id));
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => <b>{id}</b>,
    },
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => {
        return <span>{category.value}</span>;
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
              style={{ margin: "0px 10px" }}
              icon={<EditOutlined />}
              onClick={() => {
                // setCurrentCheckedKeys(item.rights);
                // setModalVisible(true);
                // setCurrentId(item.id);
              }}
            />
            <Button
              type="danger"
              shape="circle"
              style={{ margin: "0px 10px" }}
              icon={<DeleteOutlined />}
              onClick={() => confirmMethod(item)}
            />
            <Button
              shape="circle"
              style={{ margin: "0px 10px" }}
              icon={<UploadOutlined />}
              onClick={
                () => {}
                // confirmMethod(item)
              }
            />
          </div>
        );
      },
    },
  ];
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
