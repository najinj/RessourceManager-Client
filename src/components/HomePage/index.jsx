import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Icon } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import RessourceTypes from "../RessourceTypes";
import Spaces from "../Space";
import Assets from "../Asset";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const SideNav = () => {
  const [collapsed, SetCollapsed] = useState(false);

  const onCollapse = collapsedIn => {
    SetCollapsed(collapsedIn);
  };
  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="ressourceManagment" />
                  <span>Ressource Managment</span>
                </span>
              }
            >
              <Menu.Item key="3">
                <span>Ressource Types</span>
                <Link to="/RessourceTypes" />
              </Menu.Item>
              <Menu.Item key="4">
                <span>Spaces</span>
                <Link to="/Spaces" />
              </Menu.Item>
              <Menu.Item key="5">
                <span>Assets</span>
                <Link to="/Assets" />
              </Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="team" />
                  <span>Team</span>
                </span>
              }
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <Route exact path="/RessourceTypes" component={RessourceTypes} />
              <Route exact path="/Spaces" component={Spaces} />
              <Route exact path="/Assets" component={Assets} />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
};
export default SideNav;
