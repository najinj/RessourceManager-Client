/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { Table, Modal, Form, Divider, Button, Tag } from "antd";
import { shape, func, arrayOf, bool, number, string } from "prop-types";
import { connect } from "react-redux";
import ModalForm from "../ModalForm";
import {
  fetchSpaces,
  addSpace,
  updateSpace,
  deleteSpace,
  fillSpaceForm,
  emptySpaceForm
} from "../../actions/space-actions/actions";
import { getRessourceTypeByType } from "../../actions/ressourceTypes-actions/actions";
import { fetchAssets } from "../../actions/asset-actions/actions";

const EditableContext = React.createContext();
const { confirm } = Modal;

const EditableTable = ({
  form,
  spaces,
  filters,
  isLoading,
  loadEntities,
  getSpaceRessourceTypes,
  removeEntity,
  openForm,
  closeForm,
  formVisible,
  formLoading,
  formErrors,
  formFields,
  addEntity,
  updateEntity,
  loadAssets,
  assets
}) => {
  const [userAction, SetUserAction] = useState("");

  useEffect(() => {
    getSpaceRessourceTypes(1);
    loadEntities();
    loadAssets();
  }, []);

  const spaceFilter = filters.map(ressourceType => {
    return {
      text: ressourceType.name,
      value: ressourceType.id
    };
  });
  const assetFilter = assets.map(asset => {
    return {
      text: asset.name,
      value: asset.id
    };
  });
  const handleCancel = () => {
    closeForm();
    SetUserAction(null);
  };

  const deleteRow = key => {
    removeEntity(key);
  };

  const showDeleteConfirm = (type, record) => {
    confirm({
      title: `Are you sure delete this ${type}?`,
      content: `Name : ${record.name}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("OK");
        deleteRow(record.key);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  const edit = editableRecord => {
    const space = { ...editableRecord };
    const fields = columnsMaped.slice(0, 5).map(col => col.onCell(space));
    console.log(fields);
    openForm(fields);
    SetUserAction({ execute: updateEntity });
  };
  const handleAdd = () => {
    const record = {
      name: "",
      capacity: 0,
      spaceTypeId: "",
      count: 0,
      tags: [],
      assets: []
    };
    const fields = columnsMaped.slice(0, 5).map(col => col.onCell(record));
    openForm(fields);
    SetUserAction({ execute: addEntity });
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
      editable: true
    },
    {
      title: "Assets",
      dataIndex: "assets",
      width: "10%",
      editable: true,
      render: assetts => (
        <span>
          {assetts.map(asset => {
            return (
              <Tag key={`${asset.id}__${asset.name}`}>
                {asset.name.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      )
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
            <Button
              type="link"
              onClick={() => showDeleteConfirm("Space", record)}
            >
              Delete
            </Button>
          </span>
        );
      }
    }
  ];

  const MappedSpaces = spaces.map(space => ({
    key: space.id,
    name: space.name,
    capacity: space.capacity,
    spaceTypeId: space.spaceTypeId,
    count: space.count,
    tags: space.tags,
    assets: space.assests
  }));
  const columnsMaped = columns.map(col => {
    if (col.dataIndex === "spaceTypeId" || col.dataIndex === "assets") {
      return {
        ...col,
        onCell: record => ({
          key: `_${col.dataIndex}`,
          record,
          required: col.required,
          inputType: col.dataIndex === "spaceTypeId" ? "select" : "multiSelect",
          dataIndex: col.dataIndex,
          title: col.title,
          options: col.dataIndex === "spaceTypeId" ? spaceFilter : assetFilter,
          getFieldDecorator: form.getFieldDecorator,
          validateFields: form.validateFields,
          editable: !col.editable
        })
      };
    }
    return {
      ...col,
      onCell: record => ({
        key: `_${col.dataIndex}`,
        record,
        required: col.required,
        inputType: col.dataIndex === "tags" ? "tags" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        getFieldDecorator: form.getFieldDecorator,
        tagsArray: record.tags,
        validateFields: form.validateFields,
        editable: !col.editable
      })
    };
  });

  return (
    <>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <ModalForm
        title="Title"
        action={userAction}
        onCancel={handleCancel}
        validateFields={form.validateFields}
        visible={formVisible}
        fields={formFields}
        loading={formLoading}
        errors={formErrors}
      />
      <EditableContext.Provider value={form}>
        <Table
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
EditableTable.propTypes = {
  form: shape({
    getFieldDecorator: func,
    validateFields: func
  }),
  spaces: arrayOf(
    shape({
      id: string,
      name: string,
      capacity: number,
      spaceTypeId: string,
      count: number,
      tags: arrayOf(string),
      assets: arrayOf(string)
    })
  ),
  filters: arrayOf(
    shape({
      text: string,
      value: string
    })
  ),
  isLoading: bool,
  loadEntities: func,
  getSpaceRessourceTypes: func,
  removeEntity: func,
  openForm: func,
  closeForm: func,
  formVisible: bool,
  formFields: arrayOf(shape()),
  formLoading: bool,
  formErrors: arrayOf(shape()),
  addEntity: func,
  updateEntity: func,
  loadAssets: func,
  assets: arrayOf(
    shape({
      name: string,
      SpaceId: string,
      assetTypeId: string,
      status: number
    })
  )
};
EditableTable.defaultProps = {
  form: {},
  spaces: [],
  filters: [],
  isLoading: false,
  getSpaceRessourceTypes: func,
  loadEntities: func,
  removeEntity: func,
  openForm: func,
  closeForm: func,
  formVisible: false,
  formFields: null,
  formLoading: false,
  formErrors: null,
  addEntity: null,
  updateEntity: null,
  loadAssets: func,
  assets: []
};

const EditableFormTable = Form.create()(EditableTable);

const mapDispatchToProps = dispatch => {
  return {
    loadEntities: () => dispatch(fetchSpaces()),
    removeEntity: id => dispatch(deleteSpace(id)),
    getSpaceRessourceTypes: type => dispatch(getRessourceTypeByType(type)),
    openForm: form => dispatch(fillSpaceForm(form)),
    closeForm: () => dispatch(emptySpaceForm()),
    updateEntity: (id, space) => dispatch(updateSpace(id, space)),
    addEntity: space => dispatch(addSpace(space)),
    loadAssets: () => dispatch(fetchAssets())
  };
};

const mapStateToProps = state => {
  return {
    filters: state.ressourceTypeReducer.filters,
    spaces: state.spaceReducer.spaces,
    isLoading: state.ressourceTypeReducer.isLoading,
    assets: state.assetReducer.assets,
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
