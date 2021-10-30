import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Tag, Table, notification } from "antd";

export default function AuditList(props) {
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
      render: (item) => {
        return <div>{props.button(item.id)}</div>;
      },
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={props.dataSource}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      ></Table>
    </div>
  );
}
