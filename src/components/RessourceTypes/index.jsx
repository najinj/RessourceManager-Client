/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Form, Divider, Button } from "antd";
import { connect } from "react-redux";
import { shape, func, arrayOf, bool, number, string } from "prop-types";
import EditableCell from "../EditableCell";
import TableForm from "../TableForm";

import {
  fetchRessourceTypes,
  addRessourceType,
  updateRessourceType,
  deleteRessourceType,
  fillRessourceTypeForm,
  emptyRessourceTypeForm,
} from "../../actions/ressourceTypes-actions/actions";

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
  loadEntities,
  removeEntitie,
  openForm,
  closeForm,
  formVisible,
  formLoading,
  formErrors,
  formFields,
  addEntitie,
  updateEntitie
}) => {
  const [userAction, SetUserAction] = useState("");

  useEffect(() => loadEntities(), []);

  const handleCancel = () => {
    closeForm();
    SetUserAction("");
  };

  const deleteRow = key => {
    removeEntitie(key);
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
            <Button type="link" onClick={() => edit(record)}>
              Edit
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => deleteRow(record.key)}
            >
              <Button type="link">Delete</Button>
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
  const edit = editableRecord => {
    const record = { ...editableRecord };
    const formColumns = columns.map(col => {
      return {
        ...col,
        onCell: ressourceType => ({
          key: `${record.key}_${col.dataIndex}`,
          record: ressourceType,
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
    const fields = formColumns.slice(0, 3).map(col => col.onCell(record));
    console.log(fields);
    openForm(fields);
    SetUserAction({execute :updateEntitie});
  };

  const handleAdd = () => {
    const formColumns = columns.map(col => {
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
    const fields = formColumns.slice(0, 3).map(col => col.onCell(record));
    openForm(fields);
    SetUserAction({execute :addEntitie});
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
        visible={formVisible}
        fields={formFields}
        isLoading={formLoading}
        errors={formErrors}
      />

      <EditableContext.Provider value={form}>
        <Table
          components={components}
          bordered
          dataSource={MappedRessourceTypes}
          columns={columnsMaped}
          rowClassName="editable-row"
          loading={isLoading}
        />
      </EditableContext.Provider>
    </>
  );
};

const EditableFormTable = Form.create()(EditableTable);
const mapDispatchToProps = dispatch => {
  return {
    loadEntities: () => dispatch(fetchRessourceTypes()),
    removeEntitie: id => dispatch(deleteRessourceType(id)),
    openForm: form => dispatch(fillRessourceTypeForm(form)),
    closeForm: () => dispatch(emptyRessourceTypeForm()),
    updateEntitie: (id, ressourceType) =>
      dispatch(updateRessourceType(id, ressourceType)),
    addEntitie: ressourceType =>
      dispatch(addRessourceType(ressourceType)),
  };
};

const mapStateToProps = state => {
  return {
    ressourceTypes: state.ressourceTypeReducer.ressourceTypes,
    isLoading: state.ressourceTypeReducer.isLoading,
    formVisible: state.ressourceTypeReducer.ressourceTypeForm.visible,
    formFields: state.ressourceTypeReducer.ressourceTypeForm.fields,
    formErrors: state.ressourceTypeReducer.ressourceTypeForm.errors,
    formLoading: state.ressourceTypeReducer.ressourceTypeForm.loading
  };
};

EditableTable.propTypes = {
  form: shape({
    getFieldDecorator: func,
    validateFields: func
  }),
  ressourceTypes: arrayOf(
    shape({
      id: string,
      name: string,
      description: string,
      type: string,
      count: number
    })
  ),
  isLoading: bool,
  loadEntities: func,
  removeEntitie: func,
  openForm: func,
  closeForm: func,
  formVisible: bool,
  formFields: arrayOf(shape()),
  formLoading: bool,
  formErrors: arrayOf(shape()),
  addEntitie : func,
  updateEntitie : func
};
EditableTable.defaultProps = {
  form: {},
  ressourceTypes: [],
  isLoading: false,
  loadEntities: func,
  removeEntitie: func,
  openForm: func,
  closeForm: func,
  formVisible: false,
  formFields: null,
  formLoading: false,
  formErrors: null,
  addEntitie : null,
  updateEntitie : null
};

const ConnectedEditableFormTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableFormTable);

export default ConnectedEditableFormTable;
