/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Input, Form, Select, Tag, Tooltip, Icon, Modal } from "antd";
import { shape, func, arrayOf, bool, string } from "prop-types";

const Status = {
  Chained: {
    value: 0,
    title: "Chained"
  },
  Unchained: {
    value: 1,
    title: "Unchained"
  }
};

const { Option } = Select;

const getParameterCaseInsensitive = (object, key) => {
  return object[
    Object.keys(object).find(k => k.toLowerCase() === key.toLowerCase())
  ];
};

const TableForm = ({
  fields,
  action,
  onCancel,
  visible,
  errors,
  validateFields,
  loading
}) => {
  const [tags, SetTags] = useState(null);
  const [inputVisible, SetInputVisible] = useState(false);
  const [inputValue, SetInputValue] = useState("");
  const [assetStatus, SetAssetStatus] = useState("");

  useEffect(() => {
    if (fields !== null && fields.length) {
      if (fields[0].record.tags !== undefined) {
        const tagsArray = fields
          .reduce((acc, curr) => {
            if (curr.inputType === "tags") {
              acc.push(curr.record.tags);
            }
            return acc;
          }, [])
          .flat();
        SetTags(tagsArray);
      }
      if (fields[0].record.status !== undefined) {
        const status =
          fields[0].record.status === Status.Chained.value
            ? Status.Chained
            : Status.Unchained;
        SetAssetStatus(status);
      }
    }
  }, [fields]);

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
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const myTags = [...tags, inputValue];
      SetTags(myTags);
      SetInputVisible(false);
      SetInputValue("");
    }
    //
  };

  const hadnleSelectChange = (value, dataIndex) => {
    if (dataIndex === "spaceId" && value !== "") SetAssetStatus(Status.Chained);
    if (dataIndex === "spaceId" && value === "")
      SetAssetStatus(Status.Unchained);
  };

  const saveOrUpdate = () => {
    validateFields((error, row) => {
      if (error) {
        console.log(error);
        return;
      }
      const entity = { ...row };
      entity.id =
        fields[0].record.key !== "undefined" ? fields[0].record.key : "";
      if (tags !== null) entity.tags = tags;
      if (assetStatus !== "") entity.status = assetStatus.value;
      console.log(entity);
      action.execute(entity);
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

    if (field.inputType === "select") {
      return (
        <Form.Item
          style={{ margin: 0 }}
          key={field.key}
          label={field.title}
          {...itemLayout}
          {...(errors !== null &&
            errors !== undefined &&
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
              onChange={value => hadnleSelectChange(value, field.dataIndex)}
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
        <Form.Item label={field.title} {...itemLayout}>
          {tags !== null
            ? tags.map((tag, index) => {
                const isLongTag = tag.length > 20;
                const tagElem = (
                  <Tag
                    key={tag}
                    closable={index !== 0}
                    onClose={() => handleClose(tag)}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </Tag>
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
              })
            : ""}
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
        </Form.Item>
      );
    }
    if (field.dataIndex === "status") {
      return (
        <Form.Item
          style={{ margin: 0 }}
          key={field.key}
          label={field.title}
          {...itemLayout}
          {...(errors !== null &&
            errors !== undefined &&
            getParameterCaseInsensitive(errors, field.dataIndex) && {
              help: getParameterCaseInsensitive(errors, field.dataIndex),
              validateStatus: "error"
            })}
        >
          <span>{assetStatus.title}</span>
        </Form.Item>
      );
    }
    if (field.inputType === "multiSelect") {
      return (
        <Form.Item
          style={{ margin: 0 }}
          key={field.key}
          label={field.title}
          {...itemLayout}
          {...(errors !== null &&
            errors !== undefined &&
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
            initialValue: field.record[field.dataIndex]!== undefined ? field.record[field.dataIndex].map(asset => asset.id) : undefined
          })(
            <Select mode="multiple" style={{ width: "100%" }}>
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
    return (
      <Form.Item
        style={{ margin: 0 }}
        key={field.key}
        label={field.title}
        {...itemLayout}
        {...(errors !== null &&
          errors !== undefined &&
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
            <Input disabled={field.editable} />
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
TableForm.propTypes = {
  fields: arrayOf(
    shape({
      dataIndex: string,
      getFieldDecorator: func,
      inputType: string,
      key: string,
      options: arrayOf(
        shape({
          text: string,
          value: string
        })
      ),
      required: bool,
      validateFields: func,
      record: shape({
        key: string,
        name: string
      })
    })
  ),
  action: shape({
    execute: func
  }),
  onCancel: func,
  visible: bool,
  errors: arrayOf(shape()),
  validateFields: func,
  loading: bool
};
TableForm.defaultProps = {
  fields: null,
  action: {},
  onCancel: func,
  visible: false,
  errors: null,
  validateFields: func,
  loading: bool
};

export default TableForm;
