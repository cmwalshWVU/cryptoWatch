import React, { Component } from 'react'
import { recordTransaction } from '../store/actions/transactionAction';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import '../../styles/card.css';
import axios from 'axios';

class CoinbaseSignin extends Component {
    
    constructor(props) {
        super(props);
  
        this.state = {
            coinbaseAuth: false
        }
    }

    handleToken = ( props) => {
        console.log("Attempting redirect")
        axios.post(`https://us-central1-crypto-watch-dbf71.cloudfunctions.net/token`, { props })
            .then(res => {
                console.log(res);
                console.log(res.data);
                this.setState({ coinbaseAuth : true })
            })
    
    }

    render() {
        const { coinbaseAuth } = this.state;

        this.handleToken(this.props);

        if (coinbaseAuth) {
            return <Redirect to='/' />
        }
        else {
            return (
                <div className="rounded-card container">
                    <h5 className="center grey-text text-darken-3">Loading . . . </h5>
                </div>
            )
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // recordTransaction: (transaction) => dispatch(recordTransaction(transaction))
    }
}

export default connect(null, mapDispatchToProps)(CoinbaseSignin);
