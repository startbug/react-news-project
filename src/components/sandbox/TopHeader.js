import React, { useState } from "react";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const { Header } = Layout;

const TopHeader = (props) => {
  console.log(props);

  const changeCollapsed = () => {
    //改变state的isCollapsed
    props.changeCollapsed();
  };

  const { username, role } = JSON.parse(localStorage.getItem("token"));

  const menu = (
    <Menu>
      <Menu.Item key="username">{role.roleName}</Menu.Item>
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
      {props.isCollapsed ? (
        <MenuUnfoldOutlined onClick={changeCollapsed} />
      ) : (
        <MenuFoldOutlined onClick={changeCollapsed} />
      )}
      <div style={{ display: "inline", float: "right" }}>
        <span>
          欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
};

//connect()方法执行完，返回一个高阶函数，再进行包装组件，该组件就可以获得store对象
/**
 * connect(
 *  mapStateToProps 把state映射到props属性上
 *  mapDispatchToProps 把dispatch方法映射到props属性上
 * )(被包装的组件)
 */
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  };
};

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed",
    };
  },
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TopHeader));
