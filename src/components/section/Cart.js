import React, { Component } from 'react'
import axios from 'axios'
import {DataContext} from '../Context'
import {Link} from 'react-router-dom'
import Colors from './Colors'
import '../css/Details.css'
import '../css/Cart.css'

export class Cart extends Component {
    static contextType = DataContext;

    componentDidMount(){
        this.context.getTotal();
    }
    
    
    render() {
        const {cart,increase,reduction,removeProduct,total} = this.context;

        const placeOrder = () => {
            const orderLineItemsDTOList = cart.map(item => ({
              skuCode: item.skuCode,
              price: item.price,
              qty: item.count
            }));

        // Convert the payload to a string
        const payload = JSON.stringify({ orderLineItemsDTOList });

        // Make the API request using Axios
        axios
        .post('http://theshoeshop.com:9191/api/order', payload, {
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then(response => {
            // Handle the response from the API
            console.log(response);
            alert(response.data);
        })
        .catch(error => {
            // Handle any errors
            console.log(error);
        });
        
    
            }
        console.log(cart);
        if(cart.length === 0){
            return <h2 style={{textAlign:"center"}}>Nothings Product</h2>
        }else{
            return (
                <>
                    {
                        cart.map(item =>(
                            <div className="details cart" key={item.id}>
                                <img src={item.src} alt=""/>
                                <div className="box">
                                    <div className="row">
                                        <h2>{item.title}</h2>
                                        <span>${item.price * item.count}</span>
                                    </div>
                                    <Colors colors={item.colors}/>
                                    <p>{item.description}</p>
                                    <p>{item.content}</p>
                                    <div className="amount">
                                        <button className="count" onClick={() => reduction(item.id)}> - </button>
                                        <span>{item.count}</span>
                                        <button className="count" onClick={() => increase(item.id)}> + </button>
                                    </div>
                                </div>
                                <div className="delete" onClick={() => removeProduct(item.id)}>X</div>
                            </div>
                        ))
                    }
                    <div className="total">
                        <button onClick={placeOrder}>Place the order</button>
                        <h3>Total: ${total}</h3>
                    </div>
                </>
                )
            }
        }
}

export default Cart
