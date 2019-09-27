/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */

import React,{useState} from "react";
import { Input,  Form, Select,Tag , Tooltip, Icon } from "antd";

const EditableContext = React.createContext();
const { Option } = Select;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  getFieldDecorator,
  tagsArray,
  ...restProps
}) => {
  const [tags,SetTags] = useState(tagsArray);
  const [inputVisible,SetInputVisible] = useState(false);
  const [inputValue,SetInputValue] = useState('');

  const handleClose = removedTag => {
    const filteredTags = tags.filter(tag => tag !== removedTag);
    SetTags(filteredTags);
  };

  const showInput = () => {
    SetInputVisible(true);
    // this.setState({ inputVisible: true }, () => this.input.focus());

  };

  const handleInputChange = e => {
    SetInputValue(e.target.value)
   // this.setState({ inputValue: e.target.value });
  };

  const handleInputConfirm = () => {
    let  myTags  = {...tags};
    if (inputValue && tags.indexOf(inputValue) === -1) {
      myTags = [...tags, inputValue];
    }
    console.log(tags);
    SetTags(myTags);
    SetInputVisible(false);
    SetInputValue("");
  };

 // const saveInputRef = input => (this.input = input);

  const getInput = (type,options) => {
    if (type === "combo") {
      return (
        <Select initialValue="" style={{ width: 120 }}>
          {
            options.map(option=><Option value={option.value}>{option.text}</Option>)
          }        
        </Select>
      );
    }
    if (type === "tags"){
      return (
        <div>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <Tag key={tag} closable={index !== 0} onClose={() => handleClose(tag)}>
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );
            return isLongTag ? (
              <span>
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
                <Input value={tag} hidden="hidden" name={`tags[${index}]`}/>
              </span>
              
            ) : (
              <span>
                {tagElem}
                <Input value={tag} hidden="hidden" name={`tags[${index}]`}/>
              </span>
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
            <Tag onClick={showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" /> New Tag
            </Tag>
          )}
        </div>
      );
    }
     
    return <Input />;
  };
  const renderCell = () => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: dataIndex !== "tags",
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(getInput(inputType,options))}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
};


export default EditableCell;
