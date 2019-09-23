import React from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { shape } from "prop-types";

import "antd/es/form/style/css";
import "antd/es/icon/style/css";
import "antd/es/input/style/css";
import "antd/es/button/style/css";
import "antd/es/checkbox/style/css";
import "./LoginForm.css";

const NormalLoginForm = ({ form }) => {
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };

  const { getFieldDecorator } = form;
  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        {getFieldDecorator("username", {
          rules: [{ required: true, message: "Please input your username!" }]
        })(
          <Input
            prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Username"
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
        Or <a href="##">register now!</a>
      </Form.Item>
    </Form>
  );
};

const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(
  NormalLoginForm
);
NormalLoginForm.propTypes = {
  form: shape()
};
NormalLoginForm.defaultProps = {
  form: {}
};

export default WrappedNormalLoginForm;
