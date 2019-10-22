/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from "react";
import { Table, Form, Button } from "antd";
import { connect } from "react-redux";
import EditableCell from "../EditableCell";
import {
  fetchUsers,
  ActivateOrDeactivateUser
} from "../../actions/user-action/actions";

const EditableContext = React.createContext();
const filters = [
  {
    text: "Activated",
    value: true
  },
  {
    text: "Deactivated",
    value: false
  }
];

const EditableTable = ({
  form,
  users,
  isLoading,
  fetchUsers,
  ActivateOrDeactivateUser
}) => {
  useEffect(() => fetchUsers(), []);

  const activate = value => {
    ActivateOrDeactivateUser(value);
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "25%",
      sorter: (a, b) => a.name.localeCompare(b.name), // a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15%",
      sorter: (a, b) => a.email.localeCompare(b.email), // a.name.length - b.name.length,
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "Status",
      dataIndex: "activated",
      width: "15%",
      editable: false,
      onFilter: (value, record) => record.activated === value,
      filters,
      render: value => (value === false ? "Deactivated" : "Activated")
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "15%",
      render: (text, record) => {
        return (
          <span>
            <Button
              size="default"
              type="primary"
              role="presentation"
              loading={record.isLoading}
              onClick={() => activate(record.key)}
            >
              {record.activated === false ? "Activate" : "Deactivate"}
            </Button>
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

  const MappedRessourceTypes = users.map(user => ({
    key: user.email,
    name: user.name,
    email: user.email,
    activated: user.activated,
    isLoading: user.isLoading
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
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: false,
        getFieldDecorator: form.getFieldDecorator
      })
    };
  });

  return (
    <>
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
    fetchUsers: () => dispatch(fetchUsers()),
    ActivateOrDeactivateUser: email => dispatch(ActivateOrDeactivateUser(email))
  };
};

const mapStateToProps = state => {
  return {
    users: state.userReducer.users,
    isLoading: state.userReducer.isLoading
  };
};
const ConnectedEditableFormTable = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableFormTable);

export default ConnectedEditableFormTable;
