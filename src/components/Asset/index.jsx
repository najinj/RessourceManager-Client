/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Form, Divider, Button } from "antd";
import { shape, func, arrayOf, bool, number, string } from "prop-types";
import { connect } from "react-redux";
import EditableCell from "../EditableCell";
import {
  fetchAssets,
  addAsset,
  deleteAsset,
  updateAsset,
  fillAssetForm,
  emptyAssetForm
} from "../../actions/asset-actions/actions";
import { fetchSpaces } from "../../actions/space-actions/actions";
import { getRessourceTypeByType } from "../../actions/ressourceTypes-actions/actions";
import TableForm from "../TableForm";

const Status = {
  Chained: {
    value: 0,
    title: "Chained"
  },
  Unchained: {
    value: 1,
    title: "Unchained"
  }
};
const EditableContext = React.createContext();

const EditableTable = ({
  form,
  assets,
  spaces,
  isLoading,
  loadAssets,
  loadSpaces,
  addEntitie,
  deleteEentitie,
  updateEntitie,
  openForm,
  closeForm,
  formVisible,
  formLoading,
  formErrors,
  formFields,
  getAssetRessourceTypes,
  filters
}) => {
  const [userAction, SetUserAction] = useState("");

  useEffect(() => {
    getAssetRessourceTypes(2);
    loadSpaces();
    loadAssets();
  }, []);

  const spaceFiler = spaces.map(space => {
    return {
      text: space.name,
      value: space.id
    };
  });
  const assetFilter = filters.map(ressourceType => {
    return {
      text: ressourceType.name,
      value: ressourceType.id
    };
  });

  const handleCancel = () => {
    closeForm();
    SetUserAction(null);
  };

  const deleteRow = key => {
    deleteEentitie(key);
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
      dataIndex: "assetTypeId",
      width: "15%",
      editable: true,
      filters: assetFilter,
      required: true,
      onFilter: (value, record) => record.assetTypeId === value,
      render: value =>
        assetFilter.reduce(
          (acc, curr) => (curr.value === value ? curr.text : acc),
          ""
        )
    },
    {
      title: "SpaceId",
      dataIndex: "spaceId",
      width: "15%",
      editable: true,
      filters: spaceFiler,
      onFilter: (value, record) => record.spaceId === value,
      render: value =>
        spaceFiler.reduce(
          (acc, curr) => (curr.value === value ? curr.text : acc),
          ""
        )
    },
    {
      title: "Status",
      dataIndex: "status",
      required: true,
      width: "30%",
      editable: false,
      onFilter: (value, record) => record.status === value,
      filters: [
        {
          text: Status.Chained.title,
          value: Status.Chained.value
        },
        {
          text: Status.Unchained.title,
          value: Status.Unchained.value
        }
      ],
      render: value =>
        value === Status.Chained.value
          ? Status.Chained.title
          : Status.Unchained.title
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

  const MappedAssets = assets.map(asset => ({
    key: asset.id,
    name: asset.name,
    assetTypeId: asset.assetTypeId,
    status: asset.status,
    spaceId: asset.spaceId
  }));
  const columnsMaped = columns.map(col => {
    if (col.dataIndex === "assetTypeId") {
      return {
        ...col,
        onCell: record => ({
          record,
          required: col.required,
          inputType: "combo",
          dataIndex: col.dataIndex,
          title: col.title,
          options: assetFilter,
          getFieldDecorator: form.getFieldDecorator,
          tagsArray: record.tags,
          validateFields: form.validateFields,
          editable: !col.editable
        })
      };
    }
    return {
      ...col,
      onCell: record => ({
        record,
        required: col.required,
        inputType: col.dataIndex === "spaceId" ? "combo" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        options: col.dataIndex === "spaceId" ? spaceFiler : null,
        getFieldDecorator: form.getFieldDecorator,
        tagsArray: record.tags,
        validateFields: form.validateFields,
        editable: !col.editable
      })
    };
  });

  const handleAdd = () => {
    const asset = {
      name: "",
      SpaceId: "",
      assetTypeId: "",
      status: Status.Unchained
    };
    const fields = columnsMaped.slice(0, 4).map(col => col.onCell(asset));
    console.log(fields);
    openForm(fields);
    SetUserAction({ execute: addEntitie });
  };
  const edit = editableRecord => {
    const asset = { ...editableRecord };

    const fields = columnsMaped
      .slice(0, 4)
      .map(col => (col.editable ? col.onCell(asset) : col));
    console.log(fields);
    openForm(fields);
    SetUserAction({ execute: updateEntitie });
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
          dataSource={MappedAssets}
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
    loadAssets: () => dispatch(fetchAssets()),
    updateEntitie: (id, asset) => dispatch(updateAsset(id, asset)),
    deleteEentitie: id => dispatch(deleteAsset(id)),
    addEntitie: asset => dispatch(addAsset(asset)),
    loadSpaces: () => dispatch(fetchSpaces()),
    getAssetRessourceTypes: type => dispatch(getRessourceTypeByType(type)),
    openForm: form => dispatch(fillAssetForm(form)),
    closeForm: () => dispatch(emptyAssetForm())
  };
};
EditableTable.propTypes = {
  form: shape({
    getFieldDecorator: func,
    validateFields: func
  }),
  assets: arrayOf(
    shape({
      name: string,
      SpaceId: string,
      assetTypeId: string,
      status: Status.number
    })
  ),
  spaces: arrayOf(
    shape({
      id: string,
      name: string,
      capacity: number,
      spaceTypeId: string,
      count: number,
      tags: arrayOf(string),
      assests: arrayOf(string)
    })
  ),
  isLoading: bool,
  loadAssets: func,
  loadSpaces: func,
  addEntitie: func,
  deleteEentitie: func,
  updateEntitie: func,
  openForm: func,
  closeForm: func,
  formVisible: bool,
  formLoading: bool,
  formErrors: arrayOf(shape()),
  formFields: arrayOf(shape()),
  getAssetRessourceTypes: func,
  filters: arrayOf(
    shape({
      text: string,
      value: string
    })
  )
};
EditableTable.defaultProps = {
  form: shape({
    getFieldDecorator: func,
    validateFields: func
  }),
  assets: [],
  spaces: [],
  isLoading: false,
  loadAssets: func,
  loadSpaces: func,
  addEntitie: func,
  deleteEentitie: func,
  updateEntitie: func,
  openForm: func,
  closeForm: func,
  formVisible: false,
  formLoading: false,
  formErrors: null,
  formFields: [],
  getAssetRessourceTypes: func,
  filters: []
};

const mapStateToProps = state => {
  return {
    filters: state.ressourceTypeReducer.filters,
    spaces: state.spaceReducer.spaces,
    assets: state.assetReducer.assets,
    isLoading: state.ressourceTypeReducer.isLoading,
    formVisible: state.assetReducer.assetTypeForm.visible,
    formFields: state.assetReducer.assetTypeForm.fields,
    formErrors: state.assetReducer.assetTypeForm.errors,
    formLoading: state.assetReducer.assetTypeForm.loading
  };
};
const ConnectedEditableFormTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableFormTable);

export default ConnectedEditableFormTable;
