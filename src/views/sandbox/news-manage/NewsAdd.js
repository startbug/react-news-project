import React, { useEffect, useState, useRef } from "react";
import {
  PageHeader,
  Steps,
  notification,
  Button,
  Form,
  Input,
  Select,
  message,
} from "antd";
import axios from "axios";
import style from "./News.module.css";
import { withRouter } from "react-router-dom";
import NewsEditor from "../../../components/news-manage/NewsEditor";

const { Step } = Steps;
const { Option } = Select;
function NewsAdd(props) {
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState([]);

  const NewsForm = useRef(null);
  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState("");
  const user = JSON.parse(localStorage.getItem("token"));

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
          setFormInfo(res);
          setCurrent(current + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空");
      } else {
        console.log(formInfo, content);
        setCurrent(current + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (current <= 0) {
      return;
    }
    setCurrent(current - 1);
  };
  const handleSave = (auditState) => {
    axios
      .post("/news", {
        ...formInfo,
        content,
        region: user.region === "" ? "全球" : user.region,
        author: user.username,
        roleId: user.roleId,
        auditState,
        publishState: 0,
        createTime: new Date().getTime(),
        star: 0,
        view: 0,
      })
      .then((res) => {
        props.history.push(
          auditState === 0 ? "/news-manage/draft" : "/audit-manage/audit"
        );
        notification.info({
          message: `通知`,
          description: `你可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看您的新闻`,
          placement: "bottomRight",
        });
      });
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
          <NewsEditor
            getContent={(value) => {
              setContent(value);
            }}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.hidden}>33333333333</div>
      </div>
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
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

export default withRouter(NewsAdd);
