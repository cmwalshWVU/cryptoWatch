import React, { Component } from 'react'
import { recordTransaction } from '../store/actions/transactionAction';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

class CreateTransaction extends Component {
    state = {
        
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
    
        this.props.recordTransaction(this.state);
        this.props.history.push('/')
    }
    handleStateChange(item) {
        this.setState({[item.target.name]: item.target.value});
    }
    render() {
        const { auth } = this.props;
        if (!auth.uid) {
            return <Redirect to='/signin' />
        }
        else {
            return (
                <div className="container">
                    <form onSubmit={this.handleSubmit} className="white">
                        <h5 className="center grey-text text-darken-3">Record a New Transaction</h5>
                        <div class="switch">
                            <label>
                                Sell
                                <input id="isPurchase" onChange={this.handleChange} type="checkbox" />
                                <span class="lever"></span>
                                Buy
                            </label>
                        </div>
                        <div className="input-field">
                            <label htmlFor="coin"> Coin</label>
                            <input type="text" id="coin" onChange={this.handleChange}/>
                        </div>
                        <div className="input-field">
                            <label htmlFor="dollarAmount"> $ Amount: </label>
                            <input id="dollarAmount" type="number" onChange={this.handleChange}></input>
                        </div>
                        <div className="input-field">
                            Transaction Date:   
                            <input placeholder="Start Date"
                                id="transactionDate" className="datepicker" type="date" value={this.state.transactionDate}
                                onSelect={this.handleStateChange.bind(this)} onChange={this.handleChange} />
                        </div>
                        <div class="switch">
                            <label>
                                $
                                <input type="checkbox" />
                                <span class="lever"></span>
                                Crypto
                            </label>
                        </div>
                        <div className="input-field">
                            <button className="btn pink lighten-1 z-depth-0">Record</button>
                        </div>
                    </form>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
      auth: state.firebase.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        recordTransaction: (transaction) => dispatch(recordTransaction(transaction))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTransaction);
