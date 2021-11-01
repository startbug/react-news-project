import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";

const { SubMenu } = Menu;
const { Sider } = Layout;

function SideMenu(props) {
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      setMenu(res.data);
    });
  }, []);

  const [menu, setMenu] = useState([]);

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key);
  };

  const renderMenu = (menuList) => {
    return menuList.map((item) => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu key={item.key} icon={item.icon} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        checkPagePermission(item) && (
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
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
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

const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
  isCollapsed,
});

//使用withRouter高阶组件包装低阶组件，生成高阶组件，生成的路由组件的props会有相应的属性提供使用
export default connect(mapStateToProps)(withRouter(SideMenu));
