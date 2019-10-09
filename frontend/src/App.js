import React, {Component} from 'react';
import axios from 'axios';
import mongoose from 'mongoose';
import SimpleProduct from './components/SimpleProduct.js'
import SimpleLogin from './components/SimpleLogin.js'
import './App.css';

export default class App extends Component {
  constructor(props){
    super(props);

    this.handleCreateProduct = this.handleCreateProduct.bind(this);
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);


    this.state = {
      products: [],
      isLoggedIn: false
    }
  }

  componentDidMount(){
    axios.get('http://localhost:8080/').then(response => {

    
      console.log(response.data);

      if (response.data.length === 0) {
        const exampleProcut = {
          _id: mongoose.Types.ObjectId().toString(),
          product_name: "This is an example, press Edit to change name and Value",
          product_value: 0,
          product_amount: 1,
          product_totalPrice: 0
        }
     
        this.saveProductToDatabase(exampleProcut);
        response.data = [exampleProcut];
      }


      this.setState({
        products: response.data
      });
    }).catch(function (error) { console.log(error); })
  }

  render (){
    return(
      <div>
      <h1>simple product management application</h1>
      <p>to create a new product click this button:&nbsp;
      { /*we can insert dynamic data into the static parts of the HTML, by writing JavaScript code within curly brackets */}
        <button disabled= {!this.state.isLoggedIn} onClick={this.handleCreateProduct}>create product</button>
      </p>
      <SimpleLogin isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin} handleLogout={this.handleLogout}/>
      <table>
        <tbody>
          <tr><th>description</th><th>value</th><th>amount</th><th>total Price</th><th>action</th></tr>
          {/*if the JavaScript code returns an array of React components, then the generated code will loop through the array and render all components in the array*/}
          {this.state.products.map(product => <SimpleProduct key={product._id} onDelete={this.handleDeleteProduct} isLoggedIn={this.state.isLoggedIn} product={product} />)}
        </tbody>
      </table>
    </div>
    )
  };

  handleCreateProduct() {
    console.log("handleCreateProduct invoked");

    //we create a new empty Product with just an id to identify it

    const newProduct = {
      _id: mongoose.Types.ObjectId().toString(),
      product_name: "",
      product_value: 0,
      product_amount: 1,
      product_totalPrice: 0
    }

    //now we have to add the new Product to the mongodb database
    this.saveProductToDatabase(newProduct);

    // the react framework only rerenders the UI, when it detects that the state changed
    // when there is an object or an array in the state, the framework doesn't detect if a property of that object or an element of that array changed
    // we have to copy the elements of our array in a new array, in order for react to know, that we want to rerender the UI
    let newProducts = this.state.products.slice();

    //now we can add the new Product to the new array
    newProducts.push(newProduct);

    //we cannot just change the state, in order for react to know that we changed state and want rerendering, we need to call
    //the ".setState()" method. The method takes all properties of the state we want to change as arguments.
    this.setState(
      {
        products: newProducts
      }
    );
    console.log(newProduct);
  }

  //the next method is called when the "sell or dispose" button of any of the "SimpleProduct" components is clicked

  handleDeleteProduct(event) {
    const IdOfProductToDelete = event.target.id;
    console.log("Delete product with _id:" + IdOfProductToDelete);

    //we delete the Product identified by the id in the event in the mongodb database, by calling the "delete" api of our express server 

    axios.get('http://localhost:8080/delete/' + IdOfProductToDelete)
      .then(res => console.log(res.data));

    //now we delete the product in the UI and trigger an UI update by calling ".setState()"
    let newProducts = this.state.products.filter(product => {
      console.log("product.id:" + product._id + " IdOfProductToDelete:" + IdOfProductToDelete + " " + (product._id !== IdOfProductToDelete));
      return product._id !== IdOfProductToDelete;
    })
    this.setState(
      {
        products: newProducts
      }
    );
  }

  handleLogin(state) {
    axios.post('http://localhost:8080/login', state).then(res => {
      if(res.status === 200){
        let newProducts = this.state.products.slice();
        this.setState({
          products : newProducts,
          isLoggedIn : true
        });
   
      }
    });
  }

  handleLogout() {
    let newProducts = this.state.products.slice();
    this.setState({
      products : newProducts,
      isLoggedIn : false
    });
 
   

  }

  saveProductToDatabase(product) {
    axios.post('http://localhost:8080/add', product)
      .then(res => console.log(res.data));
  }
}



