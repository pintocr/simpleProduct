import React from 'react';
import axios from 'axios';
import {IProduct} from '../App';

interface IProps {
    edit: boolean;
    onDelete: Function;
    isLoggedIn: boolean;
    product: IProduct;
}

interface IState {
    delete_function: any;
    edit_mode: boolean;
    product: IProduct;
}

export default class SimpleProduct extends React.PureComponent<IProps, IState> {

    constructor(props: IProps) {
        super(props);

        this.handleEdit = this.handleEdit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleAmountIncrease = this.handleAmountIncrease.bind(this);
        this.handleAmountDecrease = this.handleAmountDecrease.bind(this);
        this.handleSave = this.handleSave.bind(this);


        this.state = {
            delete_function: props.onDelete,
            edit_mode: props.edit,
            product: props.product,
        }
    }

    render() {
        //if the component is in edit mode, it will render different than if it just shows the data
        if (this.state.edit_mode)
            return (
                <tr>
                    <td><input type="text" name="name" value={this.state.product.product_name} onChange={this.handleNameChange} /></td>
                    <td><input type="number" name="value" value={this.state.product.product_value} onChange={this.handleValueChange} /> €</td>
                    <td><input type="number" name="value" value={this.state.product.product_amount} onChange={this.handleAmountChange} /></td>
                    <td>{this.state.product.product_totalPrice}</td>
                    <td> 
                        <button disabled= {!this.props.isLoggedIn} onClick={this.handleAmountIncrease}>+ Amount</button>
                        <button disabled= {!this.props.isLoggedIn} onClick={this.handleAmountDecrease}>- Amount</button>
                        <button onClick={this.handleSave} id={this.state.product._id}>save</button>
                    </td>
                </tr>
            )
        else
            return (
               
                <tr>
                    <td>{this.state.product.product_name}</td>
                    <td>{this.state.product.product_value} €</td>
                    <td>{this.state.product.product_amount}</td>
                    <td>{this.state.product.product_totalPrice} €</td>
                    <td>
                        <button disabled= {!this.props.isLoggedIn} onClick={this.handleEdit}>edit</button>
                        <button disabled= {!this.props.isLoggedIn} onClick={this.state.delete_function} id={this.state.product._id}>sell or dispose</button>
                    </td>
                </tr>
            )
    }

    handleNameChange(event: any) {
        this.setState({
            product: {
                _id: this.state.product._id,
                product_name: event.target.value,
                product_value: this.state.product.product_value,
                product_amount: this.state.product.product_amount,
                product_totalPrice: this.state.product.product_value * this.state.product.product_amount
            }
        });
    }

    handleValueChange(event: any) {
        this.setState({
            product: {
                _id: this.state.product._id,
                product_name: this.state.product.product_name,
                product_value: event.target.value,
                product_amount: this.state.product.product_amount,
                product_totalPrice: event.target.value * this.state.product.product_amount
            }
        });
    }

    handleAmountChange(event: any) {
        this.setState({
            product: {
                _id: this.state.product._id,
                product_name: this.state.product.product_name,
                product_value: this.state.product.product_value,
                product_amount: event.target.value,
                product_totalPrice: event.target.value * this.state.product.product_value
            }
        });
    }

    handleAmountIncrease() {
        this.setState({
            product: {
                _id: this.state.product._id,
                product_name: this.state.product.product_name,
                product_value: this.state.product.product_value,
                product_amount: this.state.product.product_amount + 1,
                product_totalPrice: (this.state.product.product_amount + 1) * this.state.product.product_value
            }
        });
    }

    handleAmountDecrease() {
        this.setState({
            product: {
                _id: this.state.product._id,
                product_name: this.state.product.product_name,
                product_value: this.state.product.product_value,
                product_amount: this.state.product.product_amount - 1,
                product_totalPrice: (this.state.product.product_amount - 1) * this.state.product.product_value
            }
        });
    }

    handleSave(event: any) {
        const IdOfProductToDelete = event.target.id;
  
        axios.post('http://localhost:8080/update/' + IdOfProductToDelete, this.state.product)
            .then(res => console.log(res.data));

        this.setState({ edit_mode: false });
    }
    handleEdit() {
        this.setState({ edit_mode: true });
    }
}