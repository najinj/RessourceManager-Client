/* eslint-disable no-use-before-define */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Form, Divider, Button, Tag } from "antd";
import { connect } from "react-redux";
import EditableCell from "../EditableCell";
import TableForm from "../TableForm";
import {
  fetchSpaces,
  deleteSpace,
  fillSpaceForm,
  emptySpaceForm
} from "../../actions/space-actions/actions";
import { getRessourceTypeByType } from "../../actions/ressourceTypes-actions/actions";
import {
  ADD_SPACE_REQUEST,
  UPDATE_SPACE_REQUEST
} from "../../actions/space-actions/types";

const EditableContext = React.createContext();

const EditableTable = ({
  form,
  spaces,
  filters,
  isLoading,
  loadSpaces,
  getRessourceTypeByType,
  deleteSpace,
  openForm,
  closeForm,
  formVisible,
  formLoading,
  formErrors,
  formFields
}) => {
  const [userAction, SetUserAction] = useState("");

  useEffect(() => {
    getRessourceTypeByType(1);
    loadSpaces();
  }, []);

  const spaceFilter = filters.map(ressourceType => {
    return {
      text: ressourceType.name,
      value: ressourceType.id
    };
  });
  const handleCancel = () => {
    closeForm();
    SetUserAction("");
  };

  const deleteRow = key => {
    deleteSpace(key);
  };

  const edit = editableRecord => {
    const record = { ...editableRecord };
    const formColumns = columns.map(col => {
      if (col.dataIndex === "spaceTypeId") {
        return {
          ...col,
          onCell: record => ({
            key: `${record.key}_${col.dataIndex}`,
            record,
            required: col.required,
            inputType: "combo",
            dataIndex: col.dataIndex,
            title: col.title,
            options: spaceFilter,
            getFieldDecorator: form.getFieldDecorator,
            validateFields: form.validateFields
          })
        };
      }
      return {
        ...col,
        onCell: record => ({
          key: `${record.key}_${col.dataIndex}`,
          record,
          required: col.required,
          inputType: col.dataIndex === "tags" ? "tags" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          getFieldDecorator: form.getFieldDecorator,
          tagsArray: record.tags,
          validateFields: form.validateFields
        })
      };
    });
    const fields = formColumns.slice(0, 5).map(col => col.onCell(record));
    console.log(fields);
    openForm(fields);
    SetUserAction(UPDATE_SPACE_REQUEST);
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
      capacity: 0,
      spaceTypeId: "",
      count: 0,
      tags: [],
      assests: []
    };
    const fields = formColumns.slice(0, 5).map(col => col.onCell(record));
    openForm(fields);
    SetUserAction(ADD_SPACE_REQUEST);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "25%",
      editable: true,
      sorter: (a, b) => a.name.localeCompare(b.name), // a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"],
      required: true
    },
    {
      title: "Type",
      dataIndex: "spaceTypeId",
      required: true,
      width: "15%",
      editable: true,
      filters: spaceFilter,
      onFilter: (value, record) => record.spaceTypeId === value,
      render: value =>
        spaceFilter.reduce(
          (acc, curr) => (curr.value === value ? curr.text : acc),
          ""
        )
    },
    {
      title: "Tags",
      dataIndex: "tags",
      width: "30%",
      editable: true,
      render: tags => (
        <span>
          {tags.map(tag => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      )
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      width: "10%",
      editable: false
    },
    {
      title: "Assets",
      dataIndex: "assests",
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

  const MappedSpaces = spaces.map(space => ({
    key: space.id,
    name: space.name,
    capacity: space.capacity,
    spaceTypeId: space.spaceTypeId,
    count: space.count,
    tags: space.tags,
    assests: space.assests
  }));
  const columnsMaped = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    if (col.dataIndex === "spaceTypeId") {
      return {
        ...col,
        onCell: record => ({
          record,
          required: col.required,
          inputType: "combo",
          dataIndex: col.dataIndex,
          title: col.title,
          options: spaceFilter,
          getFieldDecorator: form.getFieldDecorator
        })
      };
    }
    return {
      ...col,
      onCell: record => ({
        record,
        required: col.required,
        inputType: col.dataIndex === "tags" ? "tags" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        getFieldDecorator: form.getFieldDecorator,
        tagsArray: record.tags
      })
    };
  });

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
          dataSource={MappedSpaces}
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
    loadSpaces: () => dispatch(fetchSpaces()),
    deleteSpace: id => dispatch(deleteSpace(id)),
    getRessourceTypeByType: type => dispatch(getRessourceTypeByType(type)),
    openForm: form => dispatch(fillSpaceForm(form)),
    closeForm: () => dispatch(emptySpaceForm())
  };
};

const mapStateToProps = state => {
  return {
    filters: state.ressourceTypeReducer.filters,
    spaces: state.spaceReducer.spaces,
    isLoading: state.ressourceTypeReducer.isLoading,

    formVisible: state.spaceReducer.spaceTypeForm.visible,
    formFields: state.spaceReducer.spaceTypeForm.fields,
    formErrors: state.spaceReducer.spaceTypeForm.errors,
    formLoading: state.spaceReducer.spaceTypeForm.loading
  };
};
const ConnectedEditableFormTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableFormTable);

export default ConnectedEditableFormTable;
