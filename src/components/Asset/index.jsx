/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Form, Divider, Button } from "antd";
import { connect } from "react-redux";
import EditableCell from "../EditableCell";
import {
  fetchAssets,
  addAsset,
  deleteAsset,
  updateAsset,
  addAssetRow,
  deleteAssetRow
} from "../../actions/asset-actions/actions";
import { fetchSpaces } from "../../actions/space-actions/actions";
import { getRessourceTypeByType } from "../../actions/ressourceTypes-actions/actions";

const Status = {
  Chained: 0,
  Unchained: 1
};
const EditableContext = React.createContext();

const EditableTable = ({
  form,
  assets,
  spaces,
  isLoading,
  fetchAssets,
  fetchSpaces,
  addAsset,
  deleteAsset,
  updateAsset,
  addAssetRow,
  deleteAssetRow,
  getRessourceTypeByType,
  filters
}) => {
  const [editingKey, SetEditingKey] = useState("");

  useEffect(() => {
    getRessourceTypeByType(2);
    fetchSpaces();
    fetchAssets();
  }, []);

  const isEditing = record => record.key === editingKey;

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

  const cancel = key => {
    if (key === undefined) deleteAssetRow(undefined);
    SetEditingKey("");
  };

  const save = (formIn, key) => {
    formIn.validateFields((error, row) => {
      if (error) {
        return;
      }
      const index = assets.findIndex(item => item.id === undefined);
      const asset = { ...row };
      if (index > -1) {
        addAsset(asset);
        SetEditingKey("");
      } else {
        asset.id = key;
        updateAsset(key, asset);
        SetEditingKey("");
      }
    });
  };
  const deleteRow = key => {
    deleteAsset(key);
  };

  const edit = key => {
    SetEditingKey(key);
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
          text: "Chained",
          value: Status.Chained
        },
        {
          text: "Unchained",
          value: Status.Unchained
        }
      ],
      render: value => (value === 0 ? "Chained" : "Unchained")
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

  const MappedAssets = assets.map(asset => ({
    key: asset.id,
    name: asset.name,
    assetTypeId: asset.assetTypeId,
    status: asset.status,
    spaceId: asset.spaceId
  }));
  const columnsMaped = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    if (col.dataIndex === "assetTypeId") {
      return {
        ...col,
        onCell: record => ({
          record,
          required: col.required,
          inputType: "combo",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          options: assetFilter,
          getFieldDecorator: form.getFieldDecorator
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
        editing: isEditing(record),
        options: col.dataIndex === "spaceId" ? spaceFiler : null,
        getFieldDecorator: form.getFieldDecorator
      })
    };
  });

  const handleAdd = () => {
    if (editingKey !== undefined) {
      addAssetRow({
        name: "",
        SpaceId: "",
        assetTypeId: "",
        status: Status.Unchained
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
          dataSource={MappedAssets}
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
    fetchAssets: () => dispatch(fetchAssets()),
    updateAsset: (id, asset) => dispatch(updateAsset(id, asset)),
    deleteAsset: id => dispatch(deleteAsset(id)),
    addAsset: asset => dispatch(addAsset(asset)),
    addAssetRow: row => dispatch(addAssetRow(row)),
    deleteAssetRow: id => dispatch(deleteAssetRow(id)),
    fetchSpaces: () => dispatch(fetchSpaces()),
    getRessourceTypeByType: type => dispatch(getRessourceTypeByType(type))
  };
};

const mapStateToProps = state => {
  return {
    filters: state.ressourceTypeReducer.filters,
    spaces: state.spaceReducer.spaces,
    assets: state.assetReducer.assets,
    isLoading: state.ressourceTypeReducer.isLoading
  };
};
const ConnectedEditableFormTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableFormTable);

export default ConnectedEditableFormTable;
