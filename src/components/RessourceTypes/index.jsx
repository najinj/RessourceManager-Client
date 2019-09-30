/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Form, Divider, Button } from "antd";
import { connect } from "react-redux";
import EditableCell from "../EditableCell";

import {
  fetchRessourceTypes,
  updateRessourceType,
  deleteRessourceType,
  addRessourceType,
  addRessourceTypeRow,
  deleteRessourceTypeRow
} from "../../actions/ressourceTypes-actions/actions";

const EditableContext = React.createContext();
const filters = [
  {
    text: "Space",
    value: 0
  },
  {
    text: "Asset",
    value: 1
  }
];

const EditableTable = ({
  form,
  ressourceTypes,
  isLoading,
  fetchRessourceTypes,
  updateRessourceType,
  deleteRessourceType,
  addRessourceType,
  addRessourceTypeRow,
  deleteRessourceTypeRow
}) => {
  const [editingKey, SetEditingKey] = useState("");

  useEffect(() => fetchRessourceTypes(), []);

  const isEditing = record => record.key === editingKey;

  const cancel = key => {
    if (key === undefined) deleteRessourceTypeRow(undefined);
    SetEditingKey("");
  };

  const save = (formIn, key) => {
    formIn.validateFields((error, row) => {
      if (error) {
        return;
      }
      const index = ressourceTypes.findIndex(item => item.id === undefined);
      const ressourceType = { ...row };
      if (index > -1) {
        console.log(ressourceType);
        addRessourceType(ressourceType);
        SetEditingKey("");
      } else {
        ressourceType.id = key;
        updateRessourceType(key, ressourceType);
        SetEditingKey("");
      }
    });
  };

  const deleteRow = key => {
    deleteRessourceType(key);
  };

  const edit = key => {
    SetEditingKey(key);
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
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to cancel?"
              onKeyPress={() => {}}
              onConfirm={() => cancel(record.key)}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <a
              role="presentation"
              disabled={editingKey !== ""}
              onKeyPress={() => {}}
              onClick={() => edit(record.key)}
            >
              Edit
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteRow(record.key)}
            >
              <a
                role="presentation"
                disabled={editingKey !== ""}
                onKeyPress={() => {}}
                onClick={() => {}}
              >
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
        record,
        required: col.required,
        inputType: col.dataIndex === "type" ? "combo" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        options: filters,
        getFieldDecorator: form.getFieldDecorator
      })
    };
  });

  const handleAdd = () => {
    if (editingKey !== undefined) {
      addRessourceTypeRow({
        name: "",
        description: "",
        type: "",
        count: 0
      });
      SetEditingKey(undefined);
    }
  };

  return (
    <>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
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
    updateRessourceType: (id, ressourceType) =>
      dispatch(updateRessourceType(id, ressourceType)),
    deleteRessourceType: id => dispatch(deleteRessourceType(id)),
    addRessourceType: ressourceType =>
      dispatch(addRessourceType(ressourceType)),
    addRessourceTypeRow: row => dispatch(addRessourceTypeRow(row)),
    deleteRessourceTypeRow: id => dispatch(deleteRessourceTypeRow(id))
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
