/* eslint-disable no-use-before-define */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Input, Form, Select, Tag, Tooltip, Icon, Checkbox, Modal } from "antd";
import { updateRessourceType } from "../../actions/ressourceTypes-actions/actions";
import {
  ADD_RESSOURCE_TYPE_REQUEST,
  UPDATE_RESSOURCE_TYPE_REQUEST
} from "../../actions/ressourceTypes-actions/types";

const CheckboxGroup = Checkbox.Group;

const { Option } = Select;

const TableForm = ({
  fields,
  action,
  onCancel,
  visible,
  errors,
  validateFields,
  updateRessourceType,
  loading
}) => {
  const [tags, SetTags] = useState([]);
  const [inputVisible, SetInputVisible] = useState(false);
  const [inputValue, SetInputValue] = useState("");

  useEffect(() => {
    if (fields !== null && typeof fields.tagsArray !== "undefined")
      SetTags(fields.tagsArray);
  });

  const handleClose = removedTag => {
    const filteredTags = tags.filter(tag => tag !== removedTag);
    SetTags(filteredTags);
  };

  const showInput = () => {
    SetInputVisible(true);
    // this.setState({ inputVisible: true }, () => this.input.focus());
  };

  const handleInputChange = e => {
    SetInputValue(e.target.value);
    // this.setState({ inputValue: e.target.value });
  };

  const handleInputConfirm = () => {
    let myTags = { ...tags };
    if (inputValue && tags.indexOf(inputValue) === -1) {
      myTags = [...tags, inputValue];
    }
    SetTags(myTags);
    SetInputVisible(false);
    SetInputValue("");
  };

  const hadnleSelectChange = value => {
    //  if (dataIndex === "spaceId" && value !== "") updateAssetRow(1); // change to enum later !
    //  if (dataIndex === "spaceId" && value === "") updateAssetRow(2);
  };

  const saveOrUpdate = () => {
    console.log(updateRessourceType);

    validateFields((error, row) => {
      if (error) {
        console.log(error);
        return;
      }
      const ressourceType = { ...row };
      if (action === ADD_RESSOURCE_TYPE_REQUEST) {
        console.log(ressourceType);
        //   addRessourceType(ressourceType);
      } else if (action === UPDATE_RESSOURCE_TYPE_REQUEST) {
        ressourceType.id = fields[0].record.key;
        updateRessourceType(ressourceType.id, ressourceType);
      }
    });
  };

  const getInput = field => {
    const itemLayout =
      field.dataIndex === "description"
        ? null
        : {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 }
          };

    if (field.inputType === "combo") {
      return (
        <Form.Item
          style={{ margin: 0 }}
          key={field.key}
          label={field.title}
          {...itemLayout}
          {...(errors !== null &&
            getParameterCaseInsensitive(errors, field.dataIndex) && {
              help: getParameterCaseInsensitive(errors, field.dataIndex),
              validateStatus: "error"
            })}
        >
          {field.getFieldDecorator(field.dataIndex, {
            rules: [
              {
                required: field.required,
                message: `Please Input ${field.title}!`
              }
            ],
            initialValue: field.record[field.dataIndex]
          })(
            <Select
              initialValue=""
              style={{ width: 120 }}
              onChange={hadnleSelectChange}
            >
              {field.options.map(option => (
                <Option
                  value={option.value}
                  key={`${field.key}_${field.dataIndex}_${option.text}`}
                >
                  {option.text}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
      );
    }
    if (field.inputType === "tags") {
      return (
        <div>
          {field.tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Form.Item
                style={{ margin: 0 }}
                label={field.title}
                {...itemLayout}
              >
                {field.getFieldDecorator(`tags[${index}]`, {
                  initialValue: tag
                })(
                  <Tag
                    key={tag}
                    closable={index !== 0}
                    onClose={() => handleClose(tag)}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </Tag>
                )}
              </Form.Item>
            );
            return isLongTag ? (
              <span>
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
              </span>
            ) : (
              <span>{tagElem}</span>
            );
          })}
          {inputVisible && (
            <Input
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <Tag
              onClick={showInput}
              style={{ background: "#fff", borderStyle: "dashed" }}
            >
              <Icon type="plus" /> New Tag
            </Tag>
          )}
          <CheckboxGroup options={tags} value={tags} hidden="hidden" />
        </div>
      );
    }
    return (
      <Form.Item
        style={{ margin: 0 }}
        key={field.key}
        label={field.title}
        {...itemLayout}
        {...(errors !== null &&
          getParameterCaseInsensitive(errors, field.dataIndex) && {
            help: getParameterCaseInsensitive(errors, field.dataIndex),
            validateStatus: "error"
          })}
      >
        {field.getFieldDecorator(field.dataIndex, {
          rules: [
            {
              required: field.required,
              message: `Please Input ${field.title}!`
            }
          ],
          initialValue: field.record[field.dataIndex]
        })(
          field.dataIndex === "description" ? (
            <Input.TextArea
              autosize={{ minRows: 4, maxRows: 8 }}
              {...itemLayout}
            />
          ) : (
            <Input />
          )
        )}
      </Form.Item>
    );
  };
  return (
    <Modal
      title="Title"
      visible={visible}
      onOk={saveOrUpdate}
      confirmLoading={loading}
      onCancel={onCancel}
    >
      <Form>{fields !== null ? fields.map(field => getInput(field)) : ""}</Form>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    updateRessourceType: (id, ressourceType) =>
      dispatch(updateRessourceType(id, ressourceType))
  };
};
const mapStateToProps = state => ({
  visible: state.ressourceTypeReducer.ressourceTypeForm.visible,
  fields: state.ressourceTypeReducer.ressourceTypeForm.fields,
  errors: state.ressourceTypeReducer.ressourceTypeForm.errors,
  loading: state.ressourceTypeReducer.ressourceTypeForm.loading
});
const ConnectedTableForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(TableForm);

export default ConnectedTableForm;

const getParameterCaseInsensitive = (object, key) => {
  return object[
    Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())
  ];
};
