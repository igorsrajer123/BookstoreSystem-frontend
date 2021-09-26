import React, { Component } from 'react';
import LoginService from './../../services/loginService';
import './userProfile.css';
import NoImage from './../../assets/noimg.webp';

export default class userProfile extends Component {
    constructor() {
        super();

        this.state = {
            currentUser: null,
            profilePhoto: null,
            action: "",
            hideUploadButton: true
        }
    }

    async componentDidMount() {
        const currentUser = await LoginService.getCurrentUser();
        if(currentUser === null){
            this.setState({currentUser: null});
            this.setState({action: ""});
            window.location.href = "http://localhost:3000/";
        }else{
            this.setState({currentUser: currentUser});
            this.setState({action: "http://localhost:8080/uploadProfileImage/" + currentUser.email});

            if(this.state.currentUser.profileImageName !== null)
                this.setState({profilePhoto: "http://localhost:8080/uploads/" + this.state.currentUser.profileImageName});
            else 
                this.setState({profilePhoto: NoImage});
        }
    }

    filePicked = () => {
        this.setState({hideUploadButton: false})
    }

    reloadPage = () => {
        window.location.reload();
    }

    render() {
        return (
            <div className="userProfileWrapper">
                <div className="userProfileLeft">
                    <img src={this.state.profilePhoto} alt="pic" className="profilePhoto" />
                    <iframe name="dummyframe" title="Just a dummy frame #1" id="dummyframe" style={{display: "none"}}></iframe>
                    <form action={this.state.action} target="dummyframe" encType="multipart/form-data" method="POST">
                        <input type="file" id="file" name="file" className="inputFile" onChange={this.filePicked} />
                        <label htmlFor="file" className="dummyLabel">Select Photo</label>
                        <input type="submit" 
                                value="Save Photo" 
                                className="submitPhoto" 
                                style={{width: this.state.hideUploadButton ? '0.1px' : '100%',
                                        height: this.state.hideUploadButton ? '0.1px' : '50%',
                                        alignSelf: 'center'}} 
                                onClick={this.reloadPage}
                                />
                    </form>
                </div>
                <div className="userProfileCenter">
                    asdasd
                </div>
                <div className="userProfileRight">
                    bbbbbbbb
                </div>
            </div>
        )
    }
}
