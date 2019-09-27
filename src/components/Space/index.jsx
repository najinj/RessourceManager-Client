/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react";
import { Table, Popconfirm, Form, Divider, Button ,Tag} from "antd";
import { connect } from "react-redux";
import EditableCell from "../EditableCell";
import {
  fetchSpaces,
  addSpace,
  deleteSpace,
  updateSpace,
  addSpaceRow,
  deleteSpaceRow
} from "../../actions/space-actions/actions";
import { getRessourceTypeByType } from "../../actions/ressourceTypes-actions/actions";


const EditableContext = React.createContext();

const EditableTable = ({
  form,
  spaces,
  filters,
  isLoading,
  fetchSpaces,
  getRessourceTypeByType,
  addSpace,
  deleteSpace,
 // updateSpace,
  addSpaceRow,
  deleteSpaceRow
}) => {
  const [editingKey, SetEditingKey] = useState("");


  useEffect(() => {
    getRessourceTypeByType(0);
    fetchSpaces();
  }, []);
  
  const isEditing = record => record.key === editingKey;

  const spaceFilter = filters.map(ressourceType=>{
    return {
      text:ressourceType.name,
      value : ressourceType.id
    }
  })

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
      const space = { ...row };
      if (index > -1) {
        addSpace(space);
        SetEditingKey("");
      } else {
        space.id = key;
        console.log(space);
        // updateSpace(key, space);
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
      dataIndex: "spaceTypeId",
      width: "15%",
      editable: true,
      filters : spaceFilter,
      onFilter: (value, record) => record.spaceTypeId === value,
      render: value => spaceFilter.reduce((acc,curr)=>curr.value === value ? curr.text : acc ,"")
    },
    {
      title: "Tags",
      dataIndex: "tags",
      width: "30%",
      editable: true,
      render : tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>)
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

  const MappedSpaces = spaces.map(space => ({
    key: space.id,
    name: space.name,
    capacity: space.capacity,
    spaceTypeId: space.spaceTypeId,
    count: space.count,
    tags: space.tags,
    assests : space.assests
  }));
  const columnsMaped = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    if(col.dataIndex === "spaceTypeId"){
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: "combo",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
          options : spaceFilter,
          getFieldDecorator : form.getFieldDecorator
        })
      };
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === "tags" ? "tags" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        getFieldDecorator : form.getFieldDecorator,
        tagsArray : record.tags
      })
    };
  });

  const handleAdd = () => {
    if (editingKey !== undefined) {
      addSpaceRow({
        name: "",
        capacity:0,
        spaceTypeId: "",
        count: 0,
        tags: [],
        assests : []
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
    fetchSpaces: () => dispatch(fetchSpaces()),
    updateSpace: (id, space) =>
    dispatch(updateSpace(id, space)),
    deleteSpace: id => dispatch(deleteSpace(id)),
    addSpace: space => dispatch(addSpace(space)),
    addSpaceRow: row => dispatch(addSpaceRow(row)),
    deleteSpaceRow: id => dispatch(deleteSpaceRow(id)),
    getRessourceTypeByType : type => dispatch(getRessourceTypeByType(type))
  };
};

const mapStateToProps = state => {
  return {
    filters: state.ressourceTypeReducer.filters,
    spaces: state.spaceReducer.spaces,
    isLoading: state.ressourceTypeReducer.isLoading
  };
};
const ConnectedEditableFormTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableFormTable);

export default ConnectedEditableFormTable;
