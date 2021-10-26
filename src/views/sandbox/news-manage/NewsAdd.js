import React, { useEffect, useState, useRef } from "react";
import { PageHeader, Steps, Button, Form, Input, Select } from "antd";
import axios from "axios";
import style from "./News.module.css";
import NewsEditor from "../../../components/news-manage/NewsEditor";

const { Step } = Steps;
const { Option } = Select;
export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState([]);

  const NewsForm = useRef(null);
  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  const layout = {
    //label和表单项的比例
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const handleNext = () => {
    if (current >= 2) {
      return;
    }
    if (current === 0) {
      NewsForm.current
        .validateFields()
        .then((res) => {
          console.log(res);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setCurrent(current + 1);
    }
  };

  const handlePrevious = () => {
    if (current <= 0) {
      return;
    }
    setCurrent(current - 1);
  };

  const onFinish = () => {};
  const onFinishFailed = () => {};

  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题, 新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : style.hidden}>
          <Form {...layout} name="basic" ref={NewsForm}>
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: "请输入新闻标题" }]}
            >
              <Input placeholder="请输入新闻标题" />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: "请选择新闻分类" }]}
            >
              <Select style={{ width: "100%" }} placeholder="请选择新闻分类">
                {categories.map((category) => {
                  return (
                    <Option value={category.id} key={category.id}>
                      {category.title}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.hidden}>
          <NewsEditor></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.hidden}>33333333333</div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary">保存草稿想</Button>
            <Button danger>提交审核</Button>
          </span>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
      </div>
    </div>
  );
}