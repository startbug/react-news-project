import React, { useEffect, useState } from "react";
import { PageHeader, Row, Card, Col, List } from "antd";
import axios from "axios";
import _ from "lodash";

export default function News() {
  const [list, setList] = useState([]);
  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      console.log(
        Object.entries(_.groupBy(res.data, (item) => item.category.title))
      );
      setList(
        //   console.log(
        Object.entries(_.groupBy(res.data, (item) => item.category.title))
        //   );
      );
    });
  }, []);

  console.log(list);

  return (
    <div
      style={{
        width: "95%",
        margin: "0 auto",
      }}
    >
      <PageHeader
        className="site-page-header"
        title="全球大新闻"
        subTitle="查看新闻"
      />
      <div className="site-card-wrapper">
        <Row gutter={[16, 16]}>
          {list.map((item) => {
            return (
              <Col span={8} key={item[0]}>
                <Card title="Card title" bordered={false} hoverable={true}>
                  <List
                    header={<div>Header</div>}
                    footer={<div>Footer</div>}
                    bordered
                    dataSource={item[1]}
                    pagination={{
                      pageSize: 3,
                    }}
                    renderItem={(data) => (
                      <List.Item>
                        <a href={`#/detail/${data.id}`}>{data.title}</a>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}
