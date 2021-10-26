import React, { useEffect } from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
//引入顶部进度条特效
import NProgress from "nprogress";
import "nprogress/nprogress.css";
//antd
import { Layout } from "antd";
//css
import "./NewsSandBox.css";
import NewsRouter from "../../components/sandbox/NewsRouter";

const { Content } = Layout;
export default function NewsSandBox() {
  //进来时加载进度条
  NProgress.start();
  useEffect(() => {
    //加载完成后,关闭进度条
    NProgress.done();
  });
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  );
}
