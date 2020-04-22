import React, { useEffect } from "react";
import { Form, Icon, Input, Button, notification } from "antd";
import { shape, func, number } from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { signIn, resetLoginErrors } from "../../actions/auth-actions/actions";

import "./index.css";

const mapDispatchToProps = dispatch => {
  return {
    logIn: user => dispatch(signIn(user)),
    resetErrors: () => dispatch(resetLoginErrors())
  };
};
const mapStateToProps = state => {
  return {
    errors: state.authReducer.errors
  };
};

const openNotification = () => {
  notification.info({
    message: `Account Not yet Activated`,
    description: "Once your account gets activated you will recieve an email",
    placement: "topLeft"
  });
};

const NormalLoginForm = ({ form, logIn, errors, resetErrors }) => {
  useEffect(() => {
    if (errors === 423) {
      openNotification();
      resetErrors();
    }
  }, [errors]);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        logIn(values);
        console.log("Received values of form: ", values);
      }
    });
  };

  const resetError = () => {
    resetErrors();
  };
  const { getFieldDecorator } = form;
  return (
    <div className="form-container">
      <div className="logo" />
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
        <Form.Item
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...(errors === 401 && {
            help: "Bad Credentials",
            validateStatus: "error"
          })}
        >
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              onChange={resetError}
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
              name="password"
            />
          )}
        </Form.Item>
        <Form.Item>
          <a className="login-form-forgot" href="/ResetPassword">
            Forgot password
          </a>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          Or <Link to="/Signup">register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

const WrappedNormalLoginForm = Form.create({ name: "normal_login" })(
  NormalLoginForm
);
NormalLoginForm.propTypes = {
  form: shape(),
  logIn: func,
  errors: number,
  resetErrors: func
};
NormalLoginForm.defaultProps = {
  form: {},
  logIn: null,
  errors: null,
  resetErrors: func
};

const ConnectedWrappedNormalLoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedNormalLoginForm);

export default ConnectedWrappedNormalLoginForm;
