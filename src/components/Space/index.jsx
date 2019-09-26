/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Table, Input, Popconfirm, Form, Select, Divider, Button } from "antd";
import { connect } from "react-redux";
import {
  fetchSpaces,
  addSpace,
  deleteSpace,
  updateSpace,
  addSpaceRow,
  deleteSpaceRow
} from "../../actions/space-actions/actions";
import {
    fetchRessourceTypes,
  } from "../../actions/ressourceTypes-actions/actions";

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
        <Select initialValue="" style={{ width: 120 }}>
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

const EditableTable = ({
  form,
  spaces,
  isLoading,
  fetchSpaces,
  addSpace,
  deleteSpace,
  updateSpace,
  addSpaceRow,
  deleteSpaceRow
}) => {
  const [editingKey, SetEditingKey] = useState("");

  useEffect(() => {
    fetchRessourceTypes();
    fetchSpaces()
  }, []);

  const isEditing = record => record.key === editingKey;

  const cancel = key => {
    if (key === undefined) deleteSpaceRow(undefined);
    SetEditingKey("");
  };

  const save = (formIn, key) => {
    formIn.validateFields((error, row) => {
      if (error) {
        return;
      }
      const index = spaces.findIndex(item => item.id === undefined);
      const ressourceType = { ...row };
      if (index > -1) {
        console.log(ressourceType);
        addSpace(ressourceType);
        SetEditingKey("");
      } else {
        ressourceType.id = key;
        updateSpace(key, ressourceType);
        SetEditingKey("");
      }
    });
  };

  const deleteRow = key => {
    deleteSpace(key);
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
      title: "Tags",
      dataIndex: "tags",
      width: "30%",
      editable: true
    },
    {
      title:"Capacity",
      dataIndex:"capacity",
      width: "10%",
      editable: false,
    },
    {
        title:"Assets",
        dataIndex:"assests",
        width: "10%",
        editable: false,
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

  const MappedSpaces = spaces.map(ressourceType => ({
    key: ressourceType.id,
    name: ressourceType.name,
    description: ressourceType.description,
    type: ressourceType.type,
    count :ressourceType.count
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

  const handleAdd = () => {    
    if(editingKey !== undefined){
      addSpaceRow({
        name: "",
        description: "",
        type: "",
        count : 0
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
          dataSource={MappedSpaces}
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
    fetchSpaces: () => dispatch(fetchSpaces()),
    updateSpace: (id, ressourceType) =>
      dispatch(updateSpace(id, ressourceType)),
      deleteSpace: id => dispatch(deleteSpace(id)),
    addSpace: ressourceType =>
      dispatch(addSpace(ressourceType)),
      addSpaceRow: row => dispatch(addSpaceRow(row)),
      deleteSpaceRow: id => dispatch(deleteSpaceRow(id))
  };
};

const mapStateToProps = state => {
  return {
    ressourceTypes: state.ressourceTypeReducer.ressourceTypes,
    spaces: state.spaceReducer.spaces,
    isLoading: state.ressourceTypeReducer.isLoading
  };
};
const ConnectedEditableFormTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableFormTable);

export default ConnectedEditableFormTable;
