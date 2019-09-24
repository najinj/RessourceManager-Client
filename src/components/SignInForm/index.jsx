/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Form, Input, Button, Col } from "antd";
import { connect } from "react-redux";
import { shape, func } from "prop-types";
import { signUp } from "../../actions/auth-actions/actions";

import "./SignInForm.css";

const mapDispatchToProps = dispatch => {
  return {
    register: user => dispatch(signUp(user))
  };
};

const SignInForm = ({ form, register }) => {
  const [confirmDirty, setConfirmDirty] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, user) => {
      if (!err) {
        register(user);
        console.log("Received values of form: ", user);
      }
    });
  };

  const handleConfirmBlur = e => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== form.getFieldValue("password")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      form.validateFields(["ConfirmPassword"], { force: true });
    }
    callback();
  };

  const { getFieldDecorator } = form;

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="login-form">
      <Form.Item>
        <Col>
          <Form.Item label="Name">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Please input your Name!"
                }
              ]
            })(<Input />)}
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label="Last Name">
            {getFieldDecorator("lastName", {
              rules: [
                {
                  required: true,
                  message: "Please input your Last Name!"
                }
              ]
            })(<Input />)}
          </Form.Item>
        </Col>
      </Form.Item>
      <Form.Item label="E-mail">
        {getFieldDecorator("email", {
          rules: [
            {
              type: "email",
              message: "The input is not valid E-mail!"
            },
            {
              required: true,
              message: "Please input your E-mail!"
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label="Password" hasFeedback>
        {getFieldDecorator("password", {
          rules: [
            {
              required: true,
              message: "Please input your password!"
            },
            {
              validator: validateToNextPassword
            }
          ]
        })(<Input.Password />)}
      </Form.Item>
      <Form.Item label="Confirm Password" hasFeedback>
        {getFieldDecorator("ConfirmPassword", {
          rules: [
            {
              required: true,
              message: "Please confirm your password!"
            },
            {
              validator: compareToFirstPassword
            }
          ]
        })(<Input.Password onBlur={handleConfirmBlur} />)}
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};
const WrappedSignInForm = Form.create({ name: "register" })(SignInForm);

SignInForm.propTypes = {
  form: shape(),
  register: func
};
SignInForm.defaultProps = {
  form: {},
  register: null
};

const ConnectedForm = connect(
  null,
  mapDispatchToProps
)(WrappedSignInForm);

export default ConnectedForm;
