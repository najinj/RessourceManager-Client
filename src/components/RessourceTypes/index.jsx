/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Table, Input, Popconfirm, Form, Select } from "antd";
import { connect } from "react-redux";
import {
  fetchRessourceTypes,
  updateRessourceType,
  deleteRessourceType,
  addRessourceType
} from "../../actions/ressourceTypes-actions/actions";

import "antd/es/table/style/css";
import "antd/es/input/style/css";
import "antd/es/popconfirm/style/css";
import "antd/es/form/style/css";
import "antd/es/select/style/css";

const { Option } = Select;

const EditableContext = React.createContext();

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const getInput = type => {
    if (type === "combo") {
      return (
        <Select defaultValue="" style={{ width: 120 }}>
          <Option value={0}>Space</Option>
          <Option value={1}>Asset</Option>
        </Select>
      );
    }
    return <Input />;
  };
  const renderCell = ({ getFieldDecorator }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(getInput(inputType))}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;
};
const mapDispatchToProps = dispatch => {
  return {
    fetchRessourceTypes: () => dispatch(fetchRessourceTypes()),
    updateRessourceType: (id, ressourceType) =>
      dispatch(updateRessourceType(id, ressourceType)),
    deleteRessourceType: id => dispatch(deleteRessourceType(id)),
    addRessourceType: ressourceType => dispatch(addRessourceType(ressourceType))
  };
};

const mapStateToProps = state => {
  return {
    ressourceTypes: state.ressourceTypeReducer.ressourceTypes,
    isLoading: state.ressourceTypeReducer.isLoading
  };
};
const EditableTable = ({
  form,
  ressourceTypes,
  isLoading,
  fetchRessourceTypes,
  updateRessourceType,
  //  deleteRessourceType,
  addRessourceType
}) => {
  const [editingKey, SetEditingKey] = useState("");

  useEffect(() => fetchRessourceTypes(), []);

  const isEditing = record => record.key === editingKey;

  const cancel = () => {
    SetEditingKey("");
  };

  const save = (formIn, key) => {
    formIn.validateFields((error, row) => {
      if (error) {
        return;
      }
      const index = ressourceTypes.findIndex(item => key === item.id);
      const ressourceType = { ...row };
      ressourceType.id = key;
      if (index > -1) {
        updateRessourceType(key, ressourceType);
        SetEditingKey("");
      } else {
        addRessourceType(ressourceType);
        SetEditingKey("");
      }
    });
  };

  const edit = key => {
    console.log(key);
    SetEditingKey(key);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "25%",
      editable: true,
      sorter: (a, b) => a.name.localeCompare(b.name), // a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "Type",
      dataIndex: "type",
      width: "15%",
      editable: true,
      filters: [
        {
          text: "Space",
          value: 0
        },
        {
          text: "Asset",
          value: 1
        }
      ],
      onFilter: (value, record) => record.type === value,
      render: value => (value === 0 ? "Space" : "Asset")
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "40%",
      editable: true
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <EditableContext.Consumer>
              {myForm => (
                <a
                  role="presentation"
                  onKeyPress={() => {}}
                  onClick={() => save(myForm, record.key)}
                  style={{ marginRight: 8 }}
                >
                  Save
                </a>
              )}
            </EditableContext.Consumer>
            <Popconfirm
              title="Sure to cancel?"
              onKeyPress={() => {}}
              onConfirm={() => cancel(record.key)}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a
            role="presentation"
            disabled={editingKey !== ""}
            onKeyPress={() => {}}
            onClick={() => edit(record.key)}
          >
            Edit
          </a>
        );
      }
    }
  ];

  const components = {
    body: {
      cell: EditableCell
    }
  };

  const MappedRessourceTypes = ressourceTypes.map(ressourceType => ({
    id: ressourceType.id,
    key: ressourceType.id,
    name: ressourceType.name,
    description: ressourceType.description,
    type: ressourceType.type
  }));
  const columnsMaped = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === "type" ? "combo" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  return (
    <EditableContext.Provider value={form}>
      <Table
        components={components}
        bordered
        dataSource={MappedRessourceTypes}
        columns={columnsMaped}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel
        }}
        loading={isLoading}
      />
    </EditableContext.Provider>
  );
};

const EditableFormTable = Form.create()(EditableTable);

const ConnectedEditableFormTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableFormTable);

export default ConnectedEditableFormTable;
