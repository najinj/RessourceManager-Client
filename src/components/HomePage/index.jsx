import React, { useState } from "react";
import { connect } from "react-redux";
import { Layout, Menu, Icon, Dropdown } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { func } from "prop-types";
import RessourceTypes from "../../Pages/RessourceTypes";
import Spaces from "../../Pages/Space";
import Assets from "../../Pages/Asset";
import Users from "../../Pages/User";
import Breadcrumbs from "../Breadcrumb";
import Calendar from "../../Pages/Calendar";
import Reservations from "../../Pages/Reservations";
import Availability from "../../Pages/Availability";
import Settings from "../../Pages/Settings";
import JwtDecoder, { ROLES_CLAIMS } from "../../Utils";
import { logout } from "../../actions/auth-actions/actions";

import "./main.css";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch(logout())
  };
};

const SideNav = ({ logoutUser }) => {
  const isAdmin =
    localStorage.getItem("token") == null
      ? false
      : JwtDecoder(localStorage.getItem("token"))[ROLES_CLAIMS].includes(
          "Admin"
        );

  console.log("isAdmin", isAdmin);

  const [collapsed, SetCollapsed] = useState(false);

  const onCollapse = collapsedIn => {
    SetCollapsed(collapsedIn);
  };

  const logoutDropDown = (
    <Menu>
      <Menu.Item onClick={() => logoutUser()}>
        <a target="_self" rel="noopener noreferrer" href="/" type="submit">
          Logout
        </a>
      </Menu.Item>
    </Menu>
  );
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
                  <Icon type="book" />
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
            {isAdmin ? (
              <Menu.Item key="11">
                <Icon type="setting" />
                <span>Settings</span>
                <Link to="/Settings" />
              </Menu.Item>
            ) : null}
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Dropdown overlay={logoutDropDown} placement="bottomRight">
              <Icon type="user" className="header-icon" />
            </Dropdown>
          </Header>
          <Content style={{ margin: "0 16px", minWidth: 660 }}>
            <Breadcrumbs style={{ margin: "16px 0" }} />
            <div
              style={{ padding: 24, background: "#fff" }}
              className="page-container"
            >
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
                render={() => <Reservations isAdmin />}
              />
              <Route exact path="/Availability" component={Availability} />
              <Route exact path="/Settings" component={Settings} />
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

SideNav.propTypes = {
  logoutUser: func
};

SideNav.defaultProps = {
  logoutUser: func
};

const ConnectedSideNav = connect(
  null,
  mapDispatchToProps
)(SideNav);

export default ConnectedSideNav;
