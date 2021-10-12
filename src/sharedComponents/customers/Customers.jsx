import React, { Component } from 'react';
import './customers.css';
import CustomerService from './../../services/customerService';
import LoginService from './../../services/loginService';
import UserService from './../../services/userService';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import DeliveryService from './../../services/deliveryService';
import DeliveryDetails from './DeliveryDetails';

export default class Customers extends Component {
    constructor() {
        super();

        this.child = React.createRef();

        this.state = {
            allCustomers: [],
            currentUser: null,
            allDeliveries: [],
            newArray: [],
            selectedDelivery: ""
        }

        this.buttonClick = this.buttonClick.bind(this);
        this.declineDeliveryRequest = this.declineDeliveryRequest.bind(this);
        this.acceptDeliveryRequest = this.acceptDeliveryRequest.bind(this);
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null || currentUser.type === "ROLE_BOOKSTORE_ADMIN" 
            || currentUser.type === "ROLE_CUSTOMER" || currentUser.type === "ROLE_SELLER")
            window.location.href = "http://localhost:3000/";

        const customers = await CustomerService.getAllCustomers();
        this.setState({allCustomers: customers.sort((a, b) => a.firstName.localeCompare(b.name))});
        const deliveries = await DeliveryService.getAllDeliveries();
        this.setState({allDeliveries: deliveries});
        let array = [];
        for(let d of deliveries) {
            const customer = await CustomerService.getCustomerByDeliveryId(d.id);
            const obj = {
                id: d.id,
                name: customer.user.firstName + " " + customer.user.lastName,
                email: customer.user.email,
                contactPhone: d.contactPhone,
                deliveryAddress: d.deliveryAddress,
                postalCode: d.postalCode,
                createdDate: d.createdDate.replace("T", " "),
                status: d.status,
                price: d.price
            }
            array.push(obj);
        }
        this.setState({newArray: array.sort((a, b) => b.createdDate.localeCompare(a.name))});
    }

    async buttonClick(userId) {
        const user = await UserService.getUserById(userId);
        if(user.enabled)
            await UserService.disableAccount(userId);
        else
            await UserService.enableAccount(userId);

        NotificationManager.success("Account status changed successfully!", "Update Successful!");
        await new Promise(resolve => setTimeout(resolve, 1500));
        window.location.reload();
    }

    async declineDeliveryRequest(id) {
        const resp = await DeliveryService.declineDelivery(id);
        if(resp === 200) {
            NotificationManager.success("Delivery successfully declined!", "Update Successful!");
        }else {
            NotificationManager.error("Something went wrong!", "Update Failed!");
        }

        let array = [];
        for(let n of this.state.newArray){
            if(n.id === id)
                n.status = "DECLINED"

            array.push(n);
        }
        this.setState({newArray: array});
    }

    async acceptDeliveryRequest(id) {
        const resp = await DeliveryService.acceptDelivery(id);
        if(resp === 200) {
            NotificationManager.success("Delivery successfully accepted!", "Update Successful!");
        }else {
            NotificationManager.error("Something went wrong!", "Update Failed!");
        }

        console.log(resp);
        let array = [];
        for(let n of this.state.newArray){
            if(n.id === id)
                n.status = "ACCEPTED"

            array.push(n);
        }
        this.setState({newArray: array});
    }

    clickOnDelivery = id => {
        this.setState({selectedDelivery: id});
        this.child.current.toggleModal();
    }

    render() {
        return (
            <div className="viewCustomersWrapper">
                <DeliveryDetails ref={this.child} delivery={this.state.selectedDelivery} />
                <div className="viewCustomersHelper">
                    <NotificationContainer />
                    <h1 className="viewCustomersHeader">Registered Customers</h1>
                    <table className="viewCustomersTable">
                        <thead className="viewCustomersTableHead">
                            <tr>
                                <th>Email</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Phone Number</th>
                                <th>Date of Birth</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="viewPublishersTableBody">
                            {this.state.allCustomers.map(c => (
                                <tr key={c.id}>
                                    <td className="viewCustomersContent">{c.user.email}</td>
                                    <td className="viewCustomersContent">{c.user.firstName}</td>
                                    <td className="viewCustomersContent">{c.user.lastName}</td>
                                    <td className="viewCustomersContent">{c.user.address}</td>
                                    <td className="viewCustomersContent">{c.user.city}</td>
                                    <td className="viewCustomersContent">{c.user.phoneNumber}</td>
                                    <td className="viewCustomersContent">{c.user.dateOfBirth}</td>
                                    <td className="viewCustomersContent"><button style={{backgroundColor: c.user.enabled ? 'crimson' : 'chartreuse'}}
                                                                                className="disableCustomerAccount"
                                                                                        onClick={() => this.buttonClick(c.user.id)}>{c.user.enabled ? 'Disable' : 'Enable'}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h1 className="viewCustomersHeader">Delivery Requests</h1>
                    <table className="viewCustomersTable">
                        <thead className="viewCustomersTableHead">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Contact Phone</th>
                                <th>Delivery Address</th>
                                <th>Postal Code</th>
                                <th>Created</th>
                                <th>Status</th>
                                <th>Price</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="viewPublishersTableBody">
                            {this.state.newArray.map((d, ddx) => (
                                <tr key={ddx}>
                                    <td className="viewCustomersContent" onClick={() => this.clickOnDelivery(d.id)}>{d.name}</td>
                                    <td className="viewCustomersContent" onClick={() => this.clickOnDelivery(d.id)}>{d.email}</td>
                                    <td className="viewCustomersContent" onClick={() => this.clickOnDelivery(d.id)}>{d.contactPhone}</td>
                                    <td className="viewCustomersContent" onClick={() => this.clickOnDelivery(d.id)}>{d.deliveryAddress}</td>
                                    <td className="viewCustomersContent" onClick={() => this.clickOnDelivery(d.id)}>{d.postalCode}</td>
                                    <td className="viewCustomersContent" onClick={() => this.clickOnDelivery(d.id)}>{d.createdDate}</td>
                                    <td className="viewCustomersContent" style={{color: d.status === 'DECLINED' ? 'red' : d.status === 'PENDING' ? 'yellow' : 'lawngreen'}} onClick={() => this.clickOnDelivery(d.id)}>{d.status}</td>
                                    <td className="viewCustomersContent" onClick={() => this.clickOnDelivery(d.id)}>{d.price}din</td>
                                    <td className="viewCustomersContent">
                                        <button style={{display: d.status === "PENDING" ? 'inline' : 'none', backgroundColor: 'lawngreen'}} onClick={() => this.acceptDeliveryRequest(d.id)} className="disableCustomerAccount">
                                            Accept
                                        </button>
                                    </td>
                                    <td className="viewCustomersContent">
                                        <button style={{display: d.status !== "PENDING" ? 'none' : 'inline', backgroundColor: 'crimson'}} onClick={() => this.declineDeliveryRequest(d.id)} className="disableCustomerAccount">
                                            Decline
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
