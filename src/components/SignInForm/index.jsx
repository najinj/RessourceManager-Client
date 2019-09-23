/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { shape } from "prop-types";
import "./SignInForm.css";

const SignInForm = ({ form }) => {
  const [confirmDirty, setConfirmDirty] = useState(false);
  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
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
      form.validateFields(["confirm"], { force: true });
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
        <Row>
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
        </Row>
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
        {getFieldDecorator("confirm", {
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
  form: shape()
};
SignInForm.defaultProps = {
  form: {}
};

export default WrappedSignInForm;
