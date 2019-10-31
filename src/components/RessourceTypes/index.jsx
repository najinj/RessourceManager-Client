/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Form, Divider, Button } from "antd";
import { connect } from "react-redux";
import EditableCell from "../EditableCell";
import TableForm from "../TableForm";

import {
  fetchRessourceTypes,
  deleteRessourceType,
  fillRessourceTypeForm,
  emptyRessourceTypeForm
} from "../../actions/ressourceTypes-actions/actions";
import {
  ADD_RESSOURCE_TYPE_REQUEST,
  UPDATE_RESSOURCE_TYPE_REQUEST
} from "../../actions/ressourceTypes-actions/types";

const EditableContext = React.createContext();
const filters = [
  {
    text: "Space",
    value: 1
  },
  {
    text: "Asset",
    value: 2
  }
];

const EditableTable = ({
  form,
  ressourceTypes,
  isLoading,
  fetchRessourceTypes,
  deleteRessourceType,
  fillRessourceTypeForm,
  emptyRessourceTypeForm
}) => {
  const [userAction, SetUserAction] = useState("");

  useEffect(() => fetchRessourceTypes(), []);

  const handleCancel = () => {
    emptyRessourceTypeForm();
    SetUserAction("");
  };

  const cancel = () => {};

  const deleteRow = key => {
    deleteRessourceType(key);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      required: true,
      width: "25%",
      editable: true,
      sorter: (a, b) => a.name.localeCompare(b.name), // a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "Type",
      dataIndex: "type",
      required: true,
      width: "15%",
      editable: true,
      filters,
      onFilter: (value, record) => record.type === value,
      render: value =>
        filters.reduce(
          (acc, curr) => (curr.value === value ? curr.text : acc),
          ""
        )
    },
    {
      title: "Description",
      dataIndex: "description",
      width: "30%",
      editable: true,
      required: false
    },
    {
      title: "count",
      dataIndex: "count",
      width: "10%",
      editable: false
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <span>
            <a
              role="presentation"
              onKeyPress={() => {}}
              onClick={() => editModal(record)}
            >
              Edit
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteRow(record.key)}
            >
              <a role="presentation" onKeyPress={() => {}} onClick={() => {}}>
                Delete
              </a>
            </Popconfirm>
          </span>
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
    key: ressourceType.id,
    name: ressourceType.name,
    description: ressourceType.description,
    type: ressourceType.type,
    count: ressourceType.count
  }));
  const columnsMaped = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        key: `${record.key}_${col.dataIndex}`,
        record: { ...record },
        required: col.required,
        inputType: col.dataIndex === "type" ? "combo" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        options: filters,
        getFieldDecorator: form.getFieldDecorator
      })
    };
  });
  const editModal = editableRecord => {
    const record = { ...editableRecord };
    const columnsMaped = columns.map(col => {
      return {
        ...col,
        onCell: record => ({
          key: `${record.key}_${col.dataIndex}`,
          record,
          required: col.required,
          inputType: col.dataIndex === "type" ? "combo" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          options: filters,
          getFieldDecorator: form.getFieldDecorator,
          validateFields: form.validateFields
        })
      };
    });
    const fields = columnsMaped.slice(0, 3).map(col => col.onCell(record));
    console.log(fields);
    fillRessourceTypeForm(fields);
    SetUserAction(UPDATE_RESSOURCE_TYPE_REQUEST);
  };

  const handleAdd = () => {
    const columnsMaped = columns.map(col => {
      return {
        ...col,
        onCell: record => ({
          key: `_${col.dataIndex}`,
          record,
          required: col.required,
          inputType: col.dataIndex === "type" ? "combo" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          options: filters,
          getFieldDecorator: form.getFieldDecorator,
          validateFields: form.validateFields
        })
      };
    });
    const record = {
      name: "",
      type: "",
      description: ""
    };
    const fields = columnsMaped.slice(0, 3).map(col => col.onCell(record));
    fillRessourceTypeForm(fields);
    SetUserAction(ADD_RESSOURCE_TYPE_REQUEST);
  };

  return (
    <>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <TableForm
        title="Title"
        action={userAction}
        onCancel={handleCancel}
        validateFields={form.validateFields}
      />

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
    </>
  );
};

const EditableFormTable = Form.create()(EditableTable);
const mapDispatchToProps = dispatch => {
  return {
    fetchRessourceTypes: () => dispatch(fetchRessourceTypes()),
    deleteRessourceType: id => dispatch(deleteRessourceType(id)),
    fillRessourceTypeForm: form => dispatch(fillRessourceTypeForm(form)),
    emptyRessourceTypeForm: () => dispatch(emptyRessourceTypeForm())
  };
};

const mapStateToProps = state => {
  return {
    ressourceTypes: state.ressourceTypeReducer.ressourceTypes,
    isLoading: state.ressourceTypeReducer.isLoading
  };
};
const ConnectedEditableFormTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableFormTable);

export default ConnectedEditableFormTable;
