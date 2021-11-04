import React, { useEffect, useState } from "react";
import { PageHeader, Descriptions } from "antd";
import axios from "axios";
import moment from "moment";
import { HeartTwoTone } from "@ant-design/icons";

export default function DetailF(props) {
  useEffect(() => {
    const id = props.match.params.id;
    axios
      .get(`/news/${id}?_expand=role&_expand=category`)
      .then((res) => {
        setNews({ ...res.data, view: res.data.view + 1 });
        return res.data;
      })
      .then((res) => {
        axios.patch(`news/${id}`, { view: res.view + 1 });
      });
  }, [props.match.params.id]);

  const handleStar = () => {
    setNews({
      ...news,
      star: news.star + 1,
    });

    axios.patch(
      `/news/${props.match.params.id}?_expand=role&_expand=category`,
      {
        ...news,
        star: news.star + 1,
      }
    );
  };

  const [news, setNews] = useState({});
  return (
    <div>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={news.title}
        subTitle={
          <div>
            <span style={{ marginRight: "10px" }}>{news?.category?.value}</span>
            <HeartTwoTone
              twoToneColor="#eb2f96"
              onClick={() => {
                handleStar();
              }}
            />
          </div>
        }
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{news.author}</Descriptions.Item>
          <Descriptions.Item label="发布时间">
            {news.publishTime
              ? moment(news.publishTime).format("yyyy-MM-DD HH:mm:ss")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="区域">{news.region}</Descriptions.Item>
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
