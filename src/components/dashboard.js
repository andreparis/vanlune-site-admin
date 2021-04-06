import React, { Component,Fragment } from 'react';
import Breadcrumb from './common/breadcrumb';
import { Navigation, Box, MessageSquare, Users, Briefcase, CreditCard, ShoppingCart, Calendar } from 'react-feather';
import CountUp from 'react-countup';
import { Chart } from "react-google-charts";
import CanvasJSReact from '../assets/canvas/canvasjs.react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import ReactLoading from 'react-loading';

import { Pie, Doughnut, Bar, Line } from 'react-chartjs-2';
import { 
    pieOptions, 
    doughnutOption, 
    lineOptions, 
    buyOption, 
    employeeData, 
    employeeOptions 
} from '../constants/chartData'
import {orderStatus} from '../constants/orderStatus';

// image impoer
import user2 from '../assets/images/dashboard/user2.jpg';
import user1 from '../assets/images/dashboard/user1.jpg';
import man from '../assets/images/dashboard/man.png';
import user from '../assets/images/dashboard/user.png';
import designer from '../assets/images/dashboard/designer.jpg'

import { getOrdersByFilter } from '../services/orders';
import {getUsersByFilter} from '../services/users';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


export class Dashboard extends Component {
    constructor(props) {
        super(props);
        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(endDate.getDate()+30);
        this.state = {
            activeShow: true,
            filters: {
                startDate: startDate,
                endDate: endDate,
                status: 0
            },
            orders: [],
            isLoading: false
        }
        this.handleStartDate = this.handleStartDate.bind(this);
        this.handleEndDate = this.handleEndDate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getValuesByFilters = async () => {
        this.state.isLoading = true;
        this.setState(this.state);

        let startDate = this.getFormattedDate(this.state.filters['startDate']);
        let endDate = this.getFormattedDate(this.state.filters['endDate']);
        let filters = { startDate, endDate };
        if (this.state.filters['status'] != '0')
            filters['status'] = this.state.filters['status'];

        let orders = await getOrdersByFilter(filters);
        let accounts = await getUsersByFilter(filters);

        if (orders && orders.length > 0) 
            this.fillOrdersDatas(orders);
        if (accounts && accounts.length > 0)
            this.fillAccountsDatas(accounts);

        this.state.isLoading = false;
        this.setState(this.state)
    }

    fillOrdersDatas = (order) => {

        let totalAmount = 0;
        let totalByProducst = {};
        let totalByAttendent = {};
        let totalByStatus = {};
        let totalByCategory = {};
        let totalByPaymentMethod = {};
        let totalByMonth = {}
        let totalByDay = {}

        for (var i = 0; i < order.length; i ++) {
            let orders = order[i];      
            
            totalAmount += orders['amount'];

            if (orders['product'] && totalByProducst[orders['product']['title']])
                totalByProducst[orders['product']['title']] += orders['amount'];
            else if (orders['product'])
                totalByProducst[orders['product']['title']] = orders['amount'];

            if (orders['attendent'] && orders['attendent']['name'] && totalByAttendent[orders['attendent']['name']])
                totalByAttendent[orders['attendent']['name']] += orders['amount'];
            else if (orders['attendent'] && orders['attendent']['name'])
                totalByAttendent[orders['attendent']['name']] = orders['amount'];
            
            if (orders['status'] && totalByStatus[orders['status']])
                totalByStatus[orders['status']] += orders['amount'];
            else if (orders['status'])
                totalByStatus[orders['status']] = orders['amount'];

            let category = orders['product']['category'];
            if (category && category['name'] && totalByCategory[category['name']])
                totalByCategory[category['name']] += orders['amount'];
            else if (category && category['name'])
                totalByCategory[category['name']] = orders['amount'];
            
            if (orders['payment'] && totalByPaymentMethod[orders['payment']])
                totalByPaymentMethod[orders['payment']] += orders['amount'];
            else if (orders['payment'])
                totalByPaymentMethod[orders['payment']] = orders['amount'];

            let createdAt = String(orders['createdAt']).split('-');
            let month = createdAt[1]
            if (month && totalByMonth[month])
                totalByMonth[month] += orders['amount'];
            else if (month)
                totalByMonth[month] = orders['amount'];

            let day = createdAt[2].split('T')[0]+"/"+month;
            if (day && totalByDay[day])
                totalByDay[day] += orders['amount'];
            else if (day)
                totalByDay[day] = orders['amount'];
        }

        this.state.totalAmount = totalAmount;
        this.state.totalOrders = order.length;
        this.state.totalByProducst = totalByProducst;
        this.state.totalByAttendent = totalByAttendent;
        this.state.totalByStatus = totalByStatus;
        this.state.totalByCategory = totalByCategory;
        this.state.totalByPaymentMethod = totalByPaymentMethod;
        this.state.totalByMonth = totalByMonth;
        this.state.totalByDay = totalByDay;

        this.setState(this.state)
    }

    fillAccountsDatas = (accounts) => {
        let totalClientsByMonth = {};
        let totalClient = 0;
        let totalStaff = 0;
        for (var i = 0; i < accounts.length; i++) {
            let account = accounts[i];

            if (account['RoleId'] < 2)
                totalClient ++;
            else if (account['RoleId'] > 1)
                totalStaff ++;
            let month =  String(account['CreatedAt']).split('-')[1]
            if (month && account['RoleId'] < 2 && totalClientsByMonth[month])
                totalClientsByMonth[month] += 1;
            else if (month && account['RoleId'] < 2)
                totalClientsByMonth[month] = 1;
        }

        this.state.totalClientsByMonth = totalClientsByMonth;
        this.state.totalClient = totalClient;
        this.state.totalStaff = totalStaff;
        console.log(this.state);
        this.setState(this.state);
    }

    getFormattedDate = (date) => {
        let datetime = new Date(date);
        let formated = moment(datetime).format("YYYY-MM-DD");

        return formated;
    }

    getEarningCurrMonth = () => {
        if (this.state.totalByMonth) {
            var currMonth = new Date();
            currMonth = currMonth.getMonth() + 1;
            if (currMonth < 10) 
                return this.state.totalByMonth['0'+currMonth];
            else
                return this.state.totalByMonth[currMonth];
        }

        return 0;
    }

    getFormattedForData = (entry) => {
        let data = [];
        for (var key in entry) {
            data.push([key, entry[key]]);
        }
        return data;
    }

    getKeysAsColumns = (entry) => {
        let data = [];
        for (var key in entry) {
            data.push(key);
        }
        return data;
    }

    getColumns = (entry, key) => {
        let data = [];
        for(var i =0; i < entry.length; i++) {
            data.push(entry[i][key]);
        }
        return data;
    }

    getTotalPerKey = (entry, length) => {
        let data = [];
        for (var key in entry) {
            data.push(entry[key]);
        }
        if (length > data.length) {
            let len = length - data.length;
            let arr = new Array(len).fill(0);
            data.concat(arr);
        }
        return data;
    }

    handleStartDate(date) {
        this.state.filters['startDate'] = date;
        this.setState(this.state);
    }

    handleEndDate(date) {
        this.state.filters['endDate'] = date
        console.log(this.state.filters);
        this.setState(this.state);
    }

    handlerFilters = (e) => {
        this.state.filters[e.target.name] = e.target.value;
        this.setState(this.state);
    }

    async handleSubmit(event) {
        event.preventDefault();
        await this.getValuesByFilters();
    }

    render() {

        const lineData = {
            labels: this.getColumns(orderStatus),
            datasets: [
                {
                    lagend: 'Status',
                    data: this.getTotalPerKey(this.state.totalByStatus),
                    borderColor: "#ff8084",
                    backgroundColor: "#ff8084",
                    borderWidth: 2
                }
            ]
        };

        const paymentData = {
            labels: this.getKeysAsColumns(this.state.totalByPaymentMethod),
            datasets: [
                {
                    lagend: 'Method',
                    data: this.getTotalPerKey(this.state.totalByPaymentMethod),
                    borderColor: "#ff8084",
                    backgroundColor: "#ff8084",
                    borderWidth: 2
                }
            ]
        };

        const userData = {
            labels: this.getKeysAsColumns(this.state.totalClientsByMonth),
            datasets: [
                {
                    lagend: 'Method',
                    data: this.getTotalPerKey(this.state.totalClientsByMonth),
                    borderColor: "#ff8084",
                    backgroundColor: "#ff8084",
                    borderWidth: 2
                }
            ]
        };

        const buyData = {
            labels:this.getKeysAsColumns(this.state.totalByDay),
            datasets: [{
                backgroundColor: "transparent",
                borderColor: "#13c9ca",
                data: this.getTotalPerKey(this.state.totalByDay),
            }]
        };

        const monthData = {
            labels:this.getKeysAsColumns(this.state.totalByMonth),
            datasets: [ {
                lagend: 'Status',
                data: this.getTotalPerKey(this.state.totalByMonth),
                borderColor: "#ff8084",
                backgroundColor: "#ff8084",
                borderWidth: 2
            }]
        };

        const doughnutOptions = {
            title: "",
            pieHole: 0.35,
            pieSliceBorderColor: "none",
            colors: ['#ff8084', '#13c9ca', '#a5a5a5'],
            legend: {
                position: "none"
            },
            pieSliceText: "none",
            tooltip: {
                trigger: "none"
            },
            animation: {
                startup: true,
                easing: 'linear',
                duration: 1500,
            },
            chartArea: { left: 0, top: 10, width: '360px', height: '100%' },
            enableInteractivity: false,
        };
        const pieOptions = {
            title: "",
            pieHole: 1,
            slices: [
                {
                    color: "#ff8084"
                },
                {
                    color: "#13c9ca"
                },
                {
                    color: "#f0b54d"
                },
            ],
            tooltip: {
                showColorCode: false
            },
            chartArea: { left: 0, top: 10, width: '360px', height: '100%' },
            legend: "none"
        };
        const LineOptions = {
            hAxis: {
                textPosition: 'none', baselineColor: 'transparent',
                gridlineColor: 'transparent',
            },
            vAxis: {
                textPosition: 'none', baselineColor: 'transparent',
                gridlineColor: 'transparent',
            },
            colors: ['#ff8084'],
            legend: 'none',
        }
        const LineOptions1 = {
            hAxis: {
                textPosition: 'none', baselineColor: 'transparent',
                gridlineColor: 'transparent',
            },
            vAxis: {
                textPosition: 'none', baselineColor: 'transparent',
                gridlineColor: 'transparent',
            },
            colors: ['#13c9ca'],
            chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
            legend: 'none',
        }
        const LineOptions2 = {
            hAxis: {
                textPosition: 'none', baselineColor: 'transparent',
                gridlineColor: 'transparent',
            },
            vAxis: {
                textPosition: 'none', baselineColor: 'transparent',
                gridlineColor: 'transparent',
            },
            colors: ['#f5ce8a'],
            chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
            legend: 'none',
        }
        const LineOptions3 = {
            hAxis: {
                textPosition: 'none', baselineColor: 'transparent',
                gridlineColor: 'transparent',
            },
            vAxis: {
                textPosition: 'none', baselineColor: 'transparent',
                gridlineColor: 'transparent',
            },
            colors: ['#a5a5a5'],
            chartArea: { left: 0, top: 0, width: '100%', height: '100%' },
            legend: 'none',
        }
        return (
            <Fragment>
                <Breadcrumb title="Dashboard" parent="Dashboard" />
                    <div className="form-group col-md-6 col-sm-6 col-xs-12">  
                        <div className="form-control col-form-label-sm">    
                            <form onSubmit={this.handleSubmit} className="needs-validation" noValidate="">
                                <h4>Filters</h4>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4">Start Date</label>
                                            <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                selected={this.state.filters['startDate']}
                                                onChange={this.handleStartDate}
                                        />
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4">End Date</label>
                                            <DatePicker
                                                dateFormat="dd/MM/yyyy"
                                                selected={this.state.filters['endDate']}
                                                onChange={this.handleEndDate}
                                            />
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-xl-3 col-md-4">Order Status</label>
                                            <select className="custom-select col-md-7" required="" name="status" onChange={this.handlerFilters}>
                                            <option value="0">All</option>
                                            {orderStatus.map((item, i) => {
                                                    return (<option key={i} value={item['id']}>{item['name']}</option>);
                                                })
                                            }
                                            </select>
                                        </div>
                                        <button className="btn btn-primary" aria-posinset="center" type="submit" >Filter</button>
                                    </div>                                   
                                </div>
                            </form>
                        </div>
                    </div>
                {this.state.isLoading ? 
                <ReactLoading type="balls" color="blue" height={500} width={50} />  
                :
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xl-3 col-md-6 xl-50">
                            <div className="card o-hidden widget-cards">
                                <div className="bg-warning card-body">
                                    <div className="media static-top-widget row">
                                        <div className="icons-widgets col-4">
                                            <div className="align-self-center text-center"><Navigation className="font-warning" /></div>
                                        </div>
                                        <div className="media-body col-8"><span className="m-0">Earnings</span>
                                            {this.state.totalAmount ?
                                                <h3 className="mb-0">R$ <CountUp className="counter" end={this.state.totalAmount} /><small> This Range</small></h3> 
                                            : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 xl-50">
                            <div className="card o-hidden  widget-cards">
                                <div className="bg-secondary card-body">
                                    <div className="media static-top-widget row">
                                        <div className="icons-widgets col-4">
                                            <div className="align-self-center text-center"><Box className="font-secondary" /></div>
                                        </div>
                                        <div className="media-body col-8"><span className="m-0">Orders</span>
                                            {this.state.totalOrders ?
                                            <h3 className="mb-0"><CountUp className="counter" end={this.state.totalOrders} /><small> This Range</small></h3>
                                            : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 xl-50">
                            <div className="card o-hidden widget-cards">
                                <div className="bg-primary card-body">
                                    <div className="media static-top-widget row">
                                        <div className="icons-widgets col-4">
                                            <div className="align-self-center text-center"><MessageSquare className="font-primary" /></div>
                                        </div>
                                        <div className="media-body col-8"><span className="m-0">Clients</span>
                                            {this.state.totalClient ? 
                                            <h3 className="mb-0"><CountUp className="counter" end={this.state.totalClient} /><small> This Range</small></h3>
                                            : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 xl-50">
                            <div className="card o-hidden widget-cards">
                                <div className="bg-danger card-body">
                                    <div className="media static-top-widget row">
                                        <div className="icons-widgets col-4">
                                            <div className="align-self-center text-center"><Users className="font-danger" /></div>
                                        </div>
                                        <div className="media-body col-8"><span className="m-0">Employers</span>
                                            {this.state.totalStaff ? <h3 className="mb-0"><CountUp className="counter" end={this.state.totalStaff} /><small> This Range</small></h3>
                                            : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 xl-100">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Amount Per Order Status</h5>
                                </div>
                                <div className="card-body">                                    
                                    {this.state.totalByStatus ? 
                                    <div className="market-chart">
                                        <Bar data={lineData} options={lineOptions} width={778} height={308} />
                                    </div> 
                                    : ''}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 xl-100">
                            <div className="card">
                            <div className="card-header">
                                    <h5>Amount Per Payment Method</h5>
                                </div>
                                <div className="card-body">                                    
                                    {this.state.totalByPaymentMethod ? 
                                    <div className="market-chart">
                                        <Bar data={paymentData} options={lineOptions} width={778} height={308} />
                                    </div> 
                                    : ''}
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Amount By Day</h5>
                                </div>
                                <div className="card-body sell-graph">
                                    <Line data={buyData} options={buyOption} width={700} height={350} />
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Amount By Month</h5>
                                </div>
                                <div className="card-body sell-graph">
                                    <Bar data={monthData} options={lineOptions} width={700} height={350} />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 xl-100">
                            <div className="card height-equal">
                                <div className="card-header">
                                    <h5>Top Best Five Sellers</h5>
                                </div>
                                <div className="card-body">
                                    <div className="user-status table-responsive latest-order-table">
                                        <table className="table table-bordernone">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Positions</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Order Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.totalByAttendent ?
                                                this.getFormattedForData(this.state.totalByAttendent)
                                                .sort(function(a, b) { return b[1] - a[1] })
                                                .map((item, i) => {
                                                    if (i > 5)
                                                        return ('');
                                                    return (
                                                        <tr>
                                                            <td>#{i + 1}</td>
                                                            <td className="font-danger">{item[0]}</td>
                                                            <td className="digits">R${item[1]}</td>
                                                        </tr>
                                                    )
                                                })
                                                : ''}                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 xl-100">
                            <div className="card height-equal">
                                <div className="card-header">
                                    <h5>Five Sellers Need Improve..</h5>
                                </div>
                                <div className="card-body">
                                    <div className="user-status table-responsive latest-order-table">
                                        <table className="table table-bordernone">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Positions</th>
                                                    <th scope="col">Name</th>
                                                    <th scope="col">Order Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.totalByAttendent ?
                                                this.getFormattedForData(this.state.totalByAttendent)
                                                .sort(function(a, b) { return a[1] - b[1] })
                                                .map((item, i) => {
                                                    if (i > 5)
                                                        return ('');
                                                    return (
                                                        <tr>
                                                            <td>#{i + 1}</td>
                                                            <td className="font-danger">{item[0]}</td>
                                                            <td className="digits">R${item[1]}</td>
                                                        </tr>
                                                    )
                                                })
                                                : ''}                                                
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 xl-100">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Orders By Category</h5>
                                </div>                               
                                <div className="card-body">
                                    <div className="order-graph">
                                        <div className="chart-block chart-vertical-center">
                                        <Chart
                                            width={"100%"}
                                            height={'100%'}
                                            chartType="PieChart"
                                            loader={<div>Loading Chart</div>}
                                            data={[["Name", "Total Value"]]
                                                .concat(this.getFormattedForData(
                                                this.state.totalByCategory))}
                                            options={doughnutOptions}
                                            legend_toggle
                                        />
                                        </div>
                                        <div className="order-graph-bottom">
                                            {this.getFormattedForData(this.state.totalByCategory)
                                            .sort(function(a, b) { return b[1] - a[1] })
                                            .map((item, i) => {
                                                return (
                                                    <div className="media">
                                                        <div className="order-color-primary"></div>
                                                        <div className="media-body">
                                                            <h6 className="mb-0">{item[0]}<span className="pull-right">R${item[1]}</span></h6>
                                                        </div>
                                                    </div>
                                                )
                                                })
                                            } 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 xl-100">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Orders By Products</h5>
                                </div>                               
                                <div className="card-body">
                                    <div className="order-graph">
                                        <div className="peity-chart-dashboard text-center">
                                            {this.state.totalByProducst ? 
                                            <Chart
                                                chartType="PieChart"
                                                data={[["Name", "Total Value"]]
                                                    .concat(this.getFormattedForData(                                                            
                                                    this.state.totalByProducst))}
                                                options={pieOptions}
                                                graph_id="PieChart"
                                                width={"100%"}
                                                height={"100%"}
                                                legend_toggle
                                            /> : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 xl-100">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Total Client By Month</h5>
                                </div>                               
                                <div className="card-body">                                    
                                    {this.state.totalClientsByMonth ? 
                                    <div className="market-chart">
                                        <Bar data={userData} options={lineOptions} width={778} height={308} />
                                    </div> 
                                    : ''}
                                </div>
                            </div>
                        </div>
                        {/* <div className="col-xl-6 xl-100">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Total Client By Month</h5>
                                </div>                               
                                <div className="card-body">
                                    <div className="order-graph">
                                        <div className="peity-chart-dashboard text-center">
                                            {this.state.totalClientsByMonth ? 
                                            <Chart
                                                chartType="PieChart"
                                                data={
                                                    [
                                                        this.getKeysAsColumns(this.state.totalClientsByMonth)
                                                    ]
                                                    .concat(
                                                        this.getFormattedForData(                                                            
                                                        this.state.totalClientsByMonth)
                                                    )}
                                                options={pieOptions}
                                                graph_id="PieChart"
                                                width={"100%"}
                                                height={"100%"}
                                                legend_toggle
                                            /> : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
                }
            </Fragment>

        )
    }
}
// javascript:void(0)

export default Dashboard
