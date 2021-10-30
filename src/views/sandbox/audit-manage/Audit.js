import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, notification } from "antd";

/**
 * roleId [1: 超级管理员, 2: 区域管理员, 3: 区域编辑]
 */
export default function Audit() {
  const [dataSource, setDataSource] = useState([]);

  const { username, roleId, region } = JSON.parse(
    localStorage.getItem("token")
  );

  useEffect(() => {
    axios.get("/news?auditState=1&_expand=category").then((res) => {
      let list = res.data;
      setDataSource(
        roleId === 1
          ? list
          : [
              ...list.filter((data) => data.author === username),
              ...list.filter(
                (data) =>
                  data.region === region &&
                  data.roleId === 3 &&
                  data.author !== username
              ),
            ]
      );
    });
  }, [username, roleId, region]);

  const handleAudit = (item, auditState, publishState) => {
    setDataSource(dataSource.filter((data) => data.id !== item.id));
    // ["未审核", "审核中", "已通过", "未通过"];
    // ["未发布", "待发布", "已上线", "已下线"];
    axios
      .patch(`/news/${item.id}`, {
        auditState,
        publishState,
      })
      .then((res) => {
        notification.info({
          message: "通知",
          description: `您可以到【审核管理-审核列表】中查看您的新闻的审核状态`,
          placement: "bottomRight",
        });
      });
  };

  const columns = [
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
      render: (author) => {
        return <span>{author}</span>;
      },
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => {
        return <span>{category?.value}</span>;
      },
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Button
            onClick={() => handleAudit(item, 2, 1)}
            style={{ marginRight: "10px" }}
            type="primary"
          >
            通过
          </Button>
          <Button danger onClick={() => handleAudit(item, 3, 0)}>
            驳回
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(item) => item.id}
        pagination={{
          pageSize: 5,
        }}
      ></Table>
    </div>
  );
}
