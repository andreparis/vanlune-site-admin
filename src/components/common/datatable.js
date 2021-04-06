import React, { Component, Fragment } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export class Datatable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedValues: [],
            subRows: [],
            myData: this.props.myData,
            editable: this.props.editable,
            deletable: this.props.deletable,
            isEditing: false,
            expanded: {}
        }
    }

    selectRow = (e, i) => {
        if (!e.target.checked) {
            this.setState({
                checkedValues: this.state.checkedValues.filter((item, j) => i !== item)
            });
        } else {
            this.state.checkedValues.push(i);
            this.setState({
                checkedValues: this.state.checkedValues
            })
        }
    }

    handleRemoveRow = () => {
        const selectedValues = this.state.checkedValues;
        const updatedData = this.state.myData.filter(function (el) {
            return selectedValues.indexOf(el.id) < 0;
        });
        this.setState({
            myData: updatedData
        })
        toast.success("Successfully Deleted !")
    };

    confirmDeleteRow = (row) => {
        if (!this.props.isConfirm)
            this.props.handleDeleteRow(row);
        else if (window.confirm('Are you sure you wish to delete this item?')) {
            this.props.handleDeleteRow(row);
        }
        this.state.myData = this.props.myData;
        this.setState(this.state)
    }

    confirmEditRow = (row) => {
        if (!this.props.isConfirm)
            this.props.handlerEditRow(row);
        else if (window.confirm('Are you sure you wish to save this update?'))
            this.props.handlerEditRow(row);
        this.state.isEditing = false;
        this.state.myData = this.props.myData;
        this.setState(this.state)
    }

    handleMultiSelect = (action) => {
        if (!this.props.isConfirm)
            this.props.multiSelectHandler(this.state.checkedValues, action);
        else if (window.confirm('Are you sure you wish to '+action+' these items?'))
            this.props.multiSelectHandler(this.state.checkedValues, action);
    }

    renderEditable = (cellInfo) => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable={this.state.editable && this.state.isEditing}
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.myData];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ myData: data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.myData[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    renderSubEditable = (cellInfo) => {
        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable={this.state.editable && this.state.isEditing}
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.subRow];
                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                    this.setState({ subRow: data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.subRow[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    }

    Capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    render() {
        const { pageSize, myClass, multiSelectOption, multiSelectColNames, pagination, subitems, subData } = this.props;
        const { myData } = this.state

        const columns = [];
        const subColumns = [];
        var arrayConstructor = [].constructor;
        for (var key in myData[0]) {

            let editable = this.renderEditable
            if (key != "Image" &&
            key != "variants" &&
            key != "images" &&
            key != "discount" &&
            myData[0][key] != undefined &&
            myData[0][key].constructor != arrayConstructor) {
                columns.push(
                    {
                        Header: <b>{this.Capitalize(key.toString())}</b>,
                        accessor: key,
                        Cell: editable,
                        style: {
                            textAlign: 'center'
                        }
                    });
            }            
        }

        var objectConstructor = ({}).constructor;
        for (var data in myData) {
            for (var obj in myData[data]) {
                if (myData[data][obj] != undefined &&
                    myData[data][obj].constructor === objectConstructor) {
                        if (myData[data][obj]['name'])
                            myData[data][obj] = myData[data][obj]['name'];
                        else if (myData[data][obj]['title'])
                            myData[data][obj] = myData[data][obj]['title']
                }
            }
        }

        if (multiSelectOption == true) {
            for (var i = 0; i < multiSelectColNames.length; i++) {
                let multiSelectColName = multiSelectColNames[i];
                
                columns.push(
                    {
                        Header: <button className="btn btn-danger btn-sm btn-delete mb-0 b-r-4"
                            onClick={
                                (e) => {
                                    this.handleMultiSelect(multiSelectColName);
                                }}>{multiSelectColName}</button>,
                        id: multiSelectColName,
                        accessor: str => multiSelectColName,
                        sortable: false,
                        style: {
                            textAlign: 'center'
                        },
                        Cell: (row) =>  { 
                            let defaultId = multiSelectColNames.length > 1 ? 
                                            multiSelectColName+String(row.original.id) 
                                            : row.original.id;
                            return (
                            <div>
                                <span >
                                    <input type="checkbox" name={row.original.id} defaultChecked={this.state.checkedValues.includes(defaultId)}
                                        onChange={e => this.selectRow(e, defaultId)} />
                                </span>
                            </div>
                        )},
                        accessor: key,
                        style: {
                            textAlign: 'center'
                        }
                    }
                )
            }            
        } else {
            columns.push(
                {
                    Header: <b>Action</b>,
                    id: 'delete',
                    accessor: str => "delete",
                    Cell: (row) => (
                        <div> {this.state.deletable ?                             
                            <span onClick={() =>  this.confirmDeleteRow(myData[row.index])}>
                                <i className="fa fa-trash" style={{ width: 35, fontSize: 20, padding: 11, color: '#e4566e' }}
                                ></i>
                            </span> : ''
                            }
                            {!this.state.editable ? '' :
                            this.props.linkTo ?
                            <this.props.linkTo id={myData[row.index]['id']}/>
                            :
                            this.state.isEditing ?
                                <span onClick={() => this.confirmEditRow(myData[row.index])}>
                                        <i className="fa fa-floppy-o" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)' }}></i>
                                </span> :
                                <span onClick={() => {this.state.isEditing = true; this.setState(this.state)}}>
                                    <i className="fa fa-pencil" style={{ width: 35, fontSize: 20, padding: 11,color:'rgb(40, 167, 69)' }}></i>
                                </span>
                            }                       
                        </div>
                    ),
                    style: {
                        textAlign: 'center'
                    },
                    sortable: false
                }
            )
        }

        if (this.props.isExpandable && 
            subitems && 
            subitems.length > 0) {
            let editable = this.renderSubEditable;
            for (var i=0; i < subitems.length; i++) {
                subColumns.push({
                    Header: <b>{this.Capitalize(subitems[i])}</b>,
                    accessor:subitems[i],
                    Cell: editable,
                    style: {
                        textAlign: 'center'
                    }
                });            
            }            
        }
        if (!this.props.isExpandable)
            return (
                <Fragment>
                    <ReactTable
                        data={myData}
                        columns={columns}
                        defaultPageSize={pageSize}
                        className={myClass}
                        showPagination={pagination}
                    />
                    <ToastContainer />
                </Fragment>);

        return (
            <Fragment>
                <ReactTable
                    data={myData}
                    columns={columns}
                    defaultPageSize={pageSize}
                    className={myClass}
                    showPagination={pagination}
                    expanded={this.state.expanded}
                    getTrProps={(state, rowInfo, column, instance, expanded) => {
                        if (this.props.isExpandable)
                        return {
                          onClick: e => {
                                let isExpanded = this.state.expanded[rowInfo.viewIndex];
                                this.state.expanded[rowInfo.viewIndex] = !isExpanded
                                this.state.subRow = this.state.myData[rowInfo.viewIndex][subData];
                                this.setState(this.state);
                          }
                        };
                      }}
                      SubComponent  = {row => {
                        if (this.props.isExpandable)
                          return(
                            <ReactTable 
                                data={this.state.subRow}
                                columns={subColumns}
                                defaultPageSize={3}
                                className={myClass}
                                showPagination={pagination}
                            />
                            );
                        }}
                />
                <ToastContainer />
            </Fragment>
        )
    }
}

export default Datatable
