import React, { useEffect, useState } from "react";
import { PageHeader, Descriptions } from "antd";
import axios from "axios";
import moment from "moment";

export default function NewsPreview(props) {
  useEffect(() => {
    const id = props.match.params.id;
    axios.get(`/news/${id}?_expand=role&_expand=category`).then((res) => {
      console.log(res.data);
      setNews(res.data);
    });
  }, [props.match.params.id]);

  const [news, setNews] = useState({});
  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const pulishList = ["未发布", "待发布", "已上线", "已下线"];
  const colorList = ["black", "orange", "green", "red"];
  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={news.title}
        subTitle={news?.category?.value}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{news.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {moment(news.createTime).format("yyyy-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {news.publishTime
              ? moment(news.publishTime).format("yyyy-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="区域">{news.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态">
            <span style={{ color: colorList[news.auditState] }}>
              {auditList[news.auditState]}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="发布状态">
            <span style={{ color: colorList[news.publishState] }}>
              {pulishList[news.publishState]}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="访问数量">{news.view}</Descriptions.Item>
          <Descriptions.Item label="点赞数量">{news.star}</Descriptions.Item>
          <Descriptions.Item label="评论数量"></Descriptions.Item>
        </Descriptions>
      </PageHeader>
      <div
        dangerouslySetInnerHTML={{
          __html: news.content,
        }}
        style={{ border: "1px solid purple" }}
      ></div>
    </div>
  );
}
