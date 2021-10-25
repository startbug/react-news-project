import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import axios from "axios";

const { SubMenu } = Menu;
const { Sider } = Layout;

const menuList = [
  {
    key: "/home",
    title: "首页",
    icon: <UserOutlined />,
  },
  {
    key: "/user-manage",
    title: "用户管理",
    icon: <UserOutlined />,
    children: [
      {
        key: "/user-manage/list",
        title: "用户列表",
        icon: <UserOutlined />,
      },
    ],
  },
  {
    key: "/right-manage",
    title: "权限管理",
    icon: <UserOutlined />,
    children: [
      {
        key: "/right-manage/role/list",
        title: "角色列表",
        icon: <UserOutlined />,
      },
      {
        key: "/right-mange/role/list",
        title: "权限列表",
        icon: <UserOutlined />,
      },
    ],
  },
];
function SideMenu(props) {
  useEffect(() => {
    axios.get("http://localhost:8000/rights?_embed=children").then((res) => {
      setMenu(res.data);
    });
  }, []);

  const [menu, setMenu] = useState([]);

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && item.pagepermisson === 1) {
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        item.pagepermisson === 1 && (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => {
              props.history.push(item.key);
            }}
          >
            {item.title}
          </Menu.Item>
        )
      );
    });
  };
  //让组件变成非受控组件，第一次渲染后，之后在修改属性，不会再受影响
  // defaultSelectedKeys={[props.location.pathname]}
  // defaultOpenKeys={[openKeys]}
  //让组件变成受控组件，渲染后，再次修改属性，会受到影响
  // SelectedKeys={[props.location.pathname]}
  // OpenKeys={[openKeys]}
  const openKeys = "/" + props.location.pathname.split("/")[1];
  return (
    <Sider trigger={null} collapsible collapsed={false}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">全球新闻发布管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[props.location.pathname]}
            defaultOpenKeys={[openKeys]}
          >
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  );
}
//使用withRouter高阶组件包装低阶组件，生成高阶组件，生成的路由组件的props会有相应的属性提供使用
export default withRouter(SideMenu);
