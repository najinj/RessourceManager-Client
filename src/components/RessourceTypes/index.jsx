/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React,{useState} from "react";
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import {connect} from "react-redux";

import "antd/es/table/style/css";
import "antd/es/input/style/css";
import "antd/es/input-number/style/css";
import "antd/es/popconfirm/style/css";
import "antd/es/form/style/css";

const data = [];
for (let i = 0; i < 100; i += 1) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}



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
  }) =>{
    const getInput = (type) => {
        if (type === 'number') {
          return <InputNumber />;
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
                      message: `Please Input ${title}!`,
                    },
                  ],
                  initialValue: record[dataIndex],
                })(getInput(inputType))}
              </Form.Item>
            ) : (
              children
            )}
          </td>
        );
      };
    return <EditableContext.Consumer>{renderCell}</EditableContext.Consumer>;  
}


const EditableTable = ({form}) =>{

    const [myData,SetMyData] = useState(data);
    const [editingKey,SetEditingKey] = useState("");

    const isEditing = record => record.key === editingKey;

    const cancel = () => {
        SetEditingKey("");
      };
    
    const save = (formIn, key) => {
        formIn.validateFields((error, row) => {
          if (error) {
            return;
          }
          const newData = [...myData];
          const index = newData.findIndex(item => key === item.key);
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
              ...item,
              ...row,
            });
            SetMyData(newData);
            SetEditingKey("");
          } else {
            newData.push(row);
            SetEditingKey("");
            SetMyData(newData);
          }
        });
      }
    
    const edit =(key) => {
        SetEditingKey(key);
      }  

    const columns = [
        {
          title: 'name',
          dataIndex: 'name',
          width: '25%',
          editable: true,
        },
        {
          title: 'age',
          dataIndex: 'age',
          width: '15%',
          editable: true,
        },
        {
          title: 'address',
          dataIndex: 'address',
          width: '40%',
          editable: true,
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          render: (text, record) => {
            const editable = isEditing(record);
            return editable ? (
              <span>
                <EditableContext.Consumer>
                  {myForm => (
                    <a
                      role="presentation"
                      onKeyPress={()=>{}}
                      onClick={() => save(myForm, record.key)}
                      style={{ marginRight: 8 }}
                    >
                      Save
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm title="Sure to cancel?" onKeyPress={()=>{}} onConfirm={() => cancel(record.key)}>
                  <a>Cancel</a>
                </Popconfirm>
              </span>
            ) : (
              <a role="presentation" disabled={editingKey !== ''} onKeyPress={()=>{}} onClick={() => edit(record.key)}>
                Edit
              </a>
            );
          },
        },
      ];

      const components = {
        body: {
          cell: EditableCell,
        },
      };
  
      const columnsMaped = columns.map(col => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: record => ({
            record,
            inputType: col.dataIndex === 'age' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      });  
      return (
        <EditableContext.Provider value={form}>
          <Table
            components={components}
            bordered
            dataSource={myData}
            columns={columnsMaped}
            rowClassName="editable-row"
            pagination={{
              onChange: cancel,
            }}
          />
        </EditableContext.Provider>
      );  
    
}



const EditableFormTable = Form.create()(EditableTable);

const ConnectedEditableFormTable = connect()(EditableFormTable);

export default ConnectedEditableFormTable;
