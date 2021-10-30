import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Tag, Table, notification } from "antd";

export default function AuditList(props) {
  const { username, region, roleId } = JSON.parse(
    localStorage.getItem("token")
  );
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios
      .get(
        `/news?username=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then((res) => {
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
  }, [username, region, roleId]);

  const handleUpdate = (id) => {
    props.history.push(`/news-manage/update/${id}`);
  };

  const handlerevoke = (id) => {
    setDataSource(dataSource.filter((data) => data.id !== id));
    axios.patch(`/news/${id}`, { auditState: 0 }).then((res) => {
      // props.history.push(`/news-manage/draft`);
      notification.info({
        message: `通知`,
        description: `你可以到草稿箱中查看您的新闻`,
        placement: "bottomRight",
      });
    });
  };

  const handlePublish = (id) => {
    axios
      .patch(`/news/${id}`, { publishState: 2, publishTime: Date.now() })
      .then((res) => {
        props.history.push(`/publish-manage/published`);
        notification.info({
          message: `通知`,
          description: `你可以到[发布管理-已发布]中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };
  const auditList = [
    <Tag>未审核</Tag>,
    <Tag color="orange">审核中</Tag>,
    <Tag color="green">已通过</Tag>,
    <Tag color="red">未通过</Tag>,
  ];
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
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState) => {
        return auditList[auditState];
      },
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          {item.auditState === 1 && (
            <Button onClick={() => handlerevoke(item.id)}>撤销</Button>
          )}
          {item.auditState === 2 && (
            <Button
              type="primary"
              danger
              onClick={() => handlePublish(item.id)}
            >
              发布
            </Button>
          )}
          {item.auditState === 3 && (
            <Button type="primary" onClick={() => handleUpdate(item.id)}>
              更新
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      ></Table>
    </div>
  );
}
