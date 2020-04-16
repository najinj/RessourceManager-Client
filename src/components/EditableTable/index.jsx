/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Table, Input, Popconfirm, Form, Button } from "antd";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  editable,
  getFieldDecorator,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
        >
          {getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ],
            initialValue: record[dataIndex]
          })(<Input />)}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({
  form,
  settings = [],
  updateSettings,
  columns,
  settingsKey
}) => {
  const [editingKey, setEditingKey] = useState("");

  const isEditing = record => record.key === editingKey;

  const edit = record => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async key => {
    try {
      const row = await form.validateFields();
      const newData = [...settings];
      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        updateSettings(newData[0], settingsKey);
        setEditingKey("");
      } else {
        newData.push(row);
        updateSettings(newData[0], settingsKey);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const tableColumns = [...columns];
  tableColumns.push({
    title: "operation",
    dataIndex: "operation",
    width: "10%",
    editable: false,
    render: (_, record) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <Button type="link" onClick={() => save(record.key)}>
            Save
          </Button>
          <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
            Cancel
          </Popconfirm>
        </span>
      ) : (
        <Button type="link" onClick={() => edit(record)}>
          Edit
        </Button>
      );
    }
  });
  const mergedColumns = tableColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        getFieldDecorator: form.getFieldDecorator,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <Form form={form} component={false}>
      {columns.length > 0 && settings.length > 0 ? (
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          style={{
            marginBottom: "5%"
          }}
          bordered
          pagination={{ position: ["none", "none"] }}
          dataSource={settings}
          columns={mergedColumns}
          rowClassName="editable-row"
        />
      ) : null}
    </Form>
  );
};

export default Form.create()(EditableTable);
