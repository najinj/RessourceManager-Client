import React, { useState } from "react";
import { Layout, Menu, Icon } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import RessourceTypes from "../RessourceTypes";
import Spaces from "../Space";
import Assets from "../Asset";
import Users from "../User";
import Breadcrumbs from "../Breadcrumb";
import Calendar from "../Calendar";
import Reservations from "../Reservations";
import Availability from "../Availability";
import JwtDecoder, { ROLES_CLAIMS } from "../../Utils";

import "./main.css";

const isAdmin = JwtDecoder(localStorage.getItem("token"))[
  ROLES_CLAIMS
].includes("Admin");

console.log("isAdmin", isAdmin);

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
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={onCollapse}
          width={230}
          breakpoint="lg"
          collapsedWidth="80"
        >
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
            {isAdmin ? (
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="form" />
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
            ) : null}

            <SubMenu
              key="sub2"
              title={
                <span>
                  <Icon type="form" />
                  <span>Reservations</span>
                </span>
              }
            >
              <Menu.Item key="6">
                <span>Availability</span>
                <Link to="/Availability" />
              </Menu.Item>
              <Menu.Item key="7">
                <span>My Reservations</span>
                <Link to="/MyReservations" />
              </Menu.Item>
              {isAdmin ? (
                <Menu.Item key="8">
                  <span>All Reservations</span>
                  <Link to="/Reservations" />
                </Menu.Item>
              ) : null}

              <Menu.Item key="9">
                <span>Calendar</span>
                <Link to="/Calendar" />
              </Menu.Item>
            </SubMenu>
            {isAdmin ? (
              <SubMenu
                key="sub3"
                title={
                  <span>
                    <Icon type="team" />
                    <span>Users Managment</span>
                  </span>
                }
              >
                <Menu.Item key="10">
                  <span>Activate Accounts</span>
                  <Link to="/Users" />
                </Menu.Item>
              </SubMenu>
            ) : null}

            <Menu.Item key="11">
              <Icon type="file" />
              <span>File</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }} />
          <Content style={{ margin: "0 16px", minWidth: 660 }}>
            <Breadcrumbs style={{ margin: "16px 0" }} />
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
              <Route exact path="/RessourceTypes" component={RessourceTypes} />
              <Route exact path="/Spaces" component={Spaces} />
              <Route exact path="/Assets" component={Assets} />
              <Route exact path="/Users" component={Users} />
              <Route exact path="/Calendar" component={Calendar} />
              <Route
                exact
                path="/MyReservations"
                render={() => <Reservations isAdmin={false} />}
              />
              <Route
                exact
                path="/Reservations"
                render={() => <Reservations isAdmin={isAdmin} />}
              />
              <Route exact path="/Availability" component={Availability} />
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
