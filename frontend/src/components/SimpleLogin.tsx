import React from 'react';

interface IProps {
    isLoggedIn: boolean;
    handleLogin: Function;
    handleLogout: Function;
}

interface IState {
    username: string;
    password: string;
}

export default class SimpleLogin extends React.PureComponent<IProps, IState>  {

    constructor(props: IProps) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.handleChangePass = this.handleChangePass.bind(this);

        this.state = {
            username: '',
            password: ''
        }
    }

    render() {
        if(!this.props.isLoggedIn){
            return (
                <div>
                    <p>Log in with your account: &nbsp;
                    <input type="text" name="username" onChange={this.handleChangeUser}/> &nbsp;
                    <input type="password" name="password" onChange={this.handleChangePass}/> &nbsp;
                    <button onClick={this.handleLogin} >log in</button> &nbsp;
                    </p>
                </div>
                )
        } else {
            return (
                <div>
                <p>Logout of your account: &nbsp;
                <button onClick={this.handleLogout}>log out</button>
                </p>
                </div>
            )
        }
        


    }

    handleLogin() {
       this.props.handleLogin(this.state);
    }

    handleLogout() {
        this.props.handleLogout();
    }

    handleChangeUser(event: any){
        this.setState({
            username: event.target.value
        })
    }

    handleChangePass(event: any){
        this.setState({
            password: event.target.value
        })
    }

}