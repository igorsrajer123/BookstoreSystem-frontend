import React, { Component } from 'react';
import './customers.css';
import CustomerService from './../../services/customerService';
import LoginService from './../../services/loginService';
import UserService from './../../services/userService';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class Customers extends Component {
    constructor() {
        super();

        this.state = {
            allCustomers: [],
            currentUser: null
        }

        this.buttonClick = this.buttonClick.bind(this);
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null || currentUser.type === "ROLE_BOOKSTORE_ADMIN" 
            || currentUser.type === "ROLE_CUSTOMER" || currentUser.type === "ROLE_SELLER")
            window.location.href = "http://localhost:3000/";

        const customers = await CustomerService.getAllCustomers();
        this.setState({allCustomers: customers});
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

    render() {
        return (
            <div className="viewCustomersWrapper">
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
                </div>
            </div>
        )
    }
}
