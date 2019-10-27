/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from "react";
import { Table, Popconfirm, Form, Divider, Button, Modal } from "antd";
import { connect } from "react-redux";
import EditableCell from "../EditableCell";
import TableForm from "../TableForm";

import {
  fetchRessourceTypes,
  updateRessourceType,
  deleteRessourceType,
  addRessourceType,
  addRessourceTypeRow,
  deleteRessourceTypeRow
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
  updateRessourceType,
  deleteRessourceType,
  addRessourceType,
  addRessourceTypeRow,
  deleteRessourceTypeRow
}) => {
  const [editingKey, SetEditingKey] = useState("");
  const [visible, SetVisible] = useState(false);

  const [editableRow, SetEditableRow] = useState(null);
  const [userAction, SetUserAction] = useState("");
  const grandChildRef = useRef(childRef);
  const childRef = useRef(grandChildRef);

  useEffect(() => fetchRessourceTypes(), []);

  const isEditing = record => record.key === editingKey;

  const handleCancel = () => {
    SetVisible(false);
    SetEditableRow(null);
    SetUserAction("");
  };

  const handleOk = () => {
    console.log(childRef);
    console.log(grandChildRef);
    // childRef.current.saveOrUpdate(form);
    //
    setTimeout(() => {
      //   SetConfirmLoading(false);
      //  SetVisible(false);
    }, 2000);
  };

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
              onClick={() => editModal(record)}
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
        key: `${record.key}_${col.dataIndex}`,
        record: { ...record },
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
    SetEditableRow(fields);
    SetUserAction(UPDATE_RESSOURCE_TYPE_REQUEST);
    SetVisible(true);
  };

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

      {editableRow && userAction !== "" ? (
        <TableForm
          title="Title"
          fields={editableRow}
          action={userAction}
          visible={visible}
          onCancel={handleCancel}
          updateRessourceType={updateRessourceType}
          validateFields={form.validateFields}
        />
      ) : (
        ""
      )}
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
