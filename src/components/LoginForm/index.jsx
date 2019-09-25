import React from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { shape, func } from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signIn } from "../../actions/auth-actions/actions";
/*
import "antd/es/form/style/css";
import "antd/es/icon/style/css";
import "antd/es/input/style/css";
import "antd/es/button/style/css";
import "antd/es/checkbox/style/css";
import "./LoginForm.css";
*/
const mapDispatchToProps = dispatch => {
  return {
    logIn: user => dispatch(signIn(user))
  };
};

// eslint-disable-next-line no-unused-vars
const NormalLoginForm = ({ form, logIn }) => {
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        logIn(values);
        console.log("Received values of form: ", values);
      }
    });
  };

  const { getFieldDecorator } = form;
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator("Email", {
          rules: [{ required: true, message: "Please input your Email!" }]
        })(
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Email"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("password", {
          rules: [{ required: true, message: "Please input your Password!" }]
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
            type="password"
            placeholder="Password"
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator("remember", {
          valuePropName: "checked",
          initialValue: true
        })(<Checkbox>Remember me</Checkbox>)}
        <a className="login-form-forgot" href="##">
          Forgot password
        </a>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <Link to="/Signup">register now!</Link>
      </Form.Item>
    </Form>
  );
};

const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(
  NormalLoginForm
);
NormalLoginForm.propTypes = {
  form: shape(),
  logIn: func
};
NormalLoginForm.defaultProps = {
  form: {},
  logIn: null
};

const ConnectedWrappedNormalLoginForm = connect(
  null,
  mapDispatchToProps
)(WrappedNormalLoginForm);

export default ConnectedWrappedNormalLoginForm;
