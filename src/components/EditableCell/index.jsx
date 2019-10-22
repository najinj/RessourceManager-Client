/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { connect } from "react-redux";
import { Input, Form, Select, Tag, Tooltip, Icon, Checkbox } from "antd";
import { updateAssetRow } from "../../actions/asset-actions/actions";

const CheckboxGroup = Checkbox.Group;

const EditableContext = React.createContext();
const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  required,
  inputType,
  record,
  index,
  children,
  options,
  getFieldDecorator,
  tagsArray,
  updateAssetRow,
  ...restProps
}) => {
  const [tags, SetTags] = useState(tagsArray);
  const [inputVisible, SetInputVisible] = useState(false);
  const [inputValue, SetInputValue] = useState("");

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
    if (dataIndex === "spaceId" && value !== "") updateAssetRow(0); // change to enum later !
    if (dataIndex === "spaceId" && value === "") updateAssetRow(1);
  };

  const getInput = (type, options) => {
    if (type === "combo") {
      return (
        <Form.Item style={{ margin: 0 }}>
          {getFieldDecorator(dataIndex, {
            rules: [
              {
                required,
                message: `Please Input ${title}!`
              }
            ],
            initialValue: record[dataIndex]
          })(
            <Select
              initialValue=""
              style={{ width: 120 }}
              onChange={hadnleSelectChange}
            >
              {options.map(option => (
                <Option value={option.value}>{option.text}</Option>
              ))}
            </Select>
          )}
        </Form.Item>
      );
    }
    if (type === "text") return <Input />;
    if (type === "tags") {
      return (
        <div>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Form.Item style={{ margin: 0 }}>
                {getFieldDecorator(`tags[${index}]`, {
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
      <Form.Item style={{ margin: 0 }}>
        {getFieldDecorator(dataIndex, {
          rules: [
            {
              required,
              message: `Please Input ${title}!`
            }
          ],
          initialValue: record[dataIndex]
        })(<Input />)}
      </Form.Item>
    );
  };
  const renderCell = () => {
    return (
      <td {...restProps}>
        {editing ? getInput(inputType, options) : children}
      </td>
    );
  };
  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
};

const mapDispatchToProps = dispatch => {
  return {
    updateAssetRow: row => dispatch(updateAssetRow(row))
  };
};

const ConnectedEditableCell = connect(
  null,
  mapDispatchToProps
)(EditableCell);

export default ConnectedEditableCell;
