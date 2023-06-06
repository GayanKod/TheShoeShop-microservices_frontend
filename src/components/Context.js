import React, { Component,useEffect  } from 'react'
import axios from 'axios';

export const DataContext = React.createContext();



export class DataProvider extends Component {

    //Arrays of products, cart and total variable
    //This is the initial state of this component
    // http://theshoeshop.com:9191/api/product

    componentDidMount() {

        const dataCart = JSON.parse(localStorage.getItem('dataCart'));
        if(dataCart !== null){
            this.setState({cart: dataCart});
        }
        const dataTotal = JSON.parse(localStorage.getItem('dataTotal'));
        if(dataTotal !== null){
            this.setState({total: dataTotal});
        }
        // Fetch product data from the API
        axios.get("http://theshoeshop.com:9191/api/product").then((res) => {
            
            console.log(res.data);
            this.setState({ products: res.data });

          }).catch((err) => {
              console.log(err.message);
          })
          .catch(error => {
            console.error('Error fetching product data:', error);
          });
      }

    state = {
        products: [],
        cart: [],
        total: 0,
        isLoading: true
        
    };

    addCart = (id) =>{
        const {products, cart} = this.state;
        const check = cart.every(item =>{
            return item._id !== id
        })
        if(check){
            const data = products.filter(product =>{
                return product._id === id
            })
            this.setState({cart: [...cart,...data]})
        }else{
            alert("The product has been added to cart.")
        }
    };
    //Here, addcart arrow function has a id parameter. 
    // in addcart we are using cart and product properties of this.state 
    // then check passed id and every product's id whether that passed id is already available in the cart, if not check varible is true
    // if check is true then filter the passed id product from products array and save to the data variable 
    // then that product added to the cart array 
    //If check if false then give user to an alert message

    reduction = id =>{
        const { cart } = this.state;
        cart.forEach(item =>{
            if(item._id === id){
                item.count === 1 ? item.count = 1 : item.count -=1;
            }
        })
        this.setState({cart: cart});
        this.getTotal();
    };


    increase = id =>{
        const { cart } = this.state;
        cart.forEach(item =>{
            if(item._id === id){
                item.count += 1;
            }
        })
        this.setState({cart: cart});
        this.getTotal();
    };

    removeProduct = id =>{
        if(window.confirm("Do you want to delete this product?")){
            const {cart} = this.state;
            cart.forEach((item, index) =>{
                if(item._id === id){
                    cart.splice(index, 1)
                }
            })
            this.setState({cart: cart});
            this.getTotal();
        }
       
    };

    componentDidUpdate(){
        localStorage.setItem('dataCart', JSON.stringify(this.state.cart))
        localStorage.setItem('dataTotal', JSON.stringify(this.state.total))
    };

    getTotal = ()=>{
        const{cart} = this.state;
        const res = cart.reduce((prev, item) => {
            return prev + (item.price * item.count);
        },0)
        this.setState({total: res})
    };

    
    // componentDidMount() {

    //     const dataCart = JSON.parse(localStorage.getItem('dataCart'));
    //     if(dataCart !== null){
    //         this.setState({cart: dataCart});
    //     }
    //     const dataTotal = JSON.parse(localStorage.getItem('dataTotal'));
    //     if(dataTotal !== null){
    //         this.setState({total: dataTotal});
    //     }
    //     // Fetch product data from the API
    //     axios.get("http://theshoeshop.com:9191/api/product").then((res) => {
            
    //         console.log(res.data);
    //         this.setState({ products: res.data });

    //       }).catch((err) => {
    //           console.log(err.message);
    //       })
    //       .catch(error => {
    //         console.error('Error fetching product data:', error);
    //       });
    //   }
   

    render() {
        const {products, cart,total} = this.state;
        const {addCart,reduction,increase,removeProduct,getTotal} = this;
        return (
            <DataContext.Provider 
            value={{products, addCart, cart, reduction,increase,removeProduct,total,getTotal}}>
                {this.props.children}
            </DataContext.Provider>
        )
    }
}


