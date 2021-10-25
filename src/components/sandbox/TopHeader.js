import React, { useState } from "react";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";

const { Header } = Layout;

const TopHeader = (props) => {
  const [collapsed, setCollapsed] = useState(false);

  const changeCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const menu = (
    <Menu>
      <Menu.Item key="username">超级管理员</Menu.Item>
      <Menu.Item
        danger
        key="loginout"
        onClick={() => {
          localStorage.removeItem("token");
          props.history.replace("/login"); //路由定位到login中
        }}
      >
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ paddingLeft: "16px" }}>
      {/* {React.createElement(
          this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: "trigger",
            onClick: this.toggle,
          }
        )} */}
      {collapsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed} />
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed} />
      )}
      <div style={{ display: "inline", float: "right" }}>
        <span>欢迎admin回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default withRouter(TopHeader);
