import React, { useState } from "react";
import { Form, Icon, Input, Button, Result } from "antd";
import { shape, func } from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  resetPasswordRequest,
  resetPassword
} from "../../actions/auth-actions/actions";

const mapDispatchToProps = dispatch => {
  return {
    requestPasswordRequest: email => dispatch(resetPasswordRequest(email)),
    resetUserPassword: body => dispatch(resetPassword(body))
  };
};

const ResetPasswordForm = ({
  form,
  resetUserPassword,
  requestPasswordRequest,
  history
}) => {
  const [confirmDirty, setConfirmDirty] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const resetToken = urlParams.get("token");

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        if (resetToken) {
          const body = {
            email: values.Email,
            password: values.password,
            confirmPassword: values.ConfirmPassword,
            resetToken: resetToken.replace(/ /g, "+")
          };
          resetUserPassword(body);
          history.push("/");
        } else {
          requestPasswordRequest(values.Email);
          setSubmitted(true);
        }
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
  const ValidatePasswordStrength = (rule, value, callback) => {
    const regex = RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);
    if (regex.test(value)) {
      form.validateFields(["ConfirmPassword"], { force: true });
      callback();
    }
    callback(
      "Password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"
    );
  };
  const validateToNextPassword = (rule, value, callback) => {
    ValidatePasswordStrength(rule, value, callback);
    if (value && confirmDirty) {
      form.validateFields(["ConfirmPassword"], { force: true });
    }
    callback();
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
        {resetToken ? (
          <>
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
          </>
        ) : null}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Reset Password
          </Button>
          Or <Link to="/LogIn">Back To Login Page</Link>
        </Form.Item>
        {submitted ? (
          <Result subTitle="If this email correspond with one that we have in our database you will receive an email for reseting your password" />
        ) : null}
      </Form>
    </div>
  );
};

const WrappedResetPasswordForm = Form.create({ name: "normal_login" })(
  ResetPasswordForm
);
ResetPasswordForm.propTypes = {
  form: shape(),
  resetUserPassword: func,
  requestPasswordRequest: func,
  history: shape()
};
ResetPasswordForm.defaultProps = {
  form: {},
  resetUserPassword: func,
  requestPasswordRequest: func,
  history: {}
};

const ConnectedWrappedResetPasswordForm = connect(
  null,
  mapDispatchToProps
)(WrappedResetPasswordForm);

export default ConnectedWrappedResetPasswordForm;
