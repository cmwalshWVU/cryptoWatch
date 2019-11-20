import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import '../../styles/card.css'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { recordTransaction } from '../store/actions/transactionAction';
import { connect } from 'react-redux';

class TransactionDialog extends Component {
    state = {
        isPurchase: false,
        coin: undefined,
        selectedTab: 0
    }

    componentDidMount() {
        if(this.props.tab !== undefined) {
            this.setState({selectedTab: this.props.tab})
        }
      }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
    
        this.props.recordTransaction(this.state);
        this.props.toggleModal()
    }

    handleTabChange = (tab) => {
        console.log("calling reset state")
        this.setState({
            isPurchase: false,
            coin: undefined,
            numberOfCoins: undefined,
            dollarAmount: undefined,
            selectedTab: tab})
    }

    render() {
        console.log("Modal Open: " +this.props.modalOpen)
        return (
            <div>
                <Dialog className="transaction-form" open={this.props.modalOpen} onClose={this.props.toggleModal} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title"><center>New Transaction</center></DialogTitle>
                    <DialogContent>
                        <form  onSubmit={this.handleSubmit} >
                            <Tabs className="auth-tabs" value={this.state.selectedTab}  aria-label="authTabs">
                                <Tab className="auth-tab" label="Coin" onClick={() => this.handleTabChange(0)} />
                                <Tab className="auth-tab-icon" label="$" onClick={() => this.handleTabChange(1)} />
                            </Tabs>
                            {this.state.selectedTab === 0 ?
                                <>
                                    <div className="buyOrSell switch">
                                        <label className="buyOrSellLabel">
                                            Sell
                                            <input id="isPurchase" onChange={this.handleChange} type="checkbox" />
                                            <span className="lever"></span>
                                            Buy
                                        </label>
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="coin"> Coin</label>
                                        <input type="text" id="coin" onChange={this.handleChange}/>
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="numberOfCoins"># of Coins: </label>
                                        <input id="numberOfCoins" type="number" step="any" onChange={this.handleChange}></input>
                                    </div>
                                </>
                            : 
                            <>
                                <div className="buyOrSell switch">
                                    <label className="buyOrSellLabel">
                                        Sell
                                        <input id="isPurchase" onChange={this.handleChange} type="checkbox" />
                                        <span className="lever"></span>
                                        Buy
                                    </label>
                                </div>
                                <div className="input-field">
                                    <label htmlFor="coin"> Coin</label>
                                    <input type="text" id="coin"  onChange={this.handleChange}/>
                                </div>
                                <div className="input-field">
                                    <label htmlFor="dollarAmount" step="any"> $ Amount: </label>
                                    <input id="dollarAmount" type="number" onChange={this.handleChange}></input>
                                </div>
                            </>
                            }
                            <DialogActions>
                                <div className="input-field">
                                    <button className="btn pink lighten-1 z-depth-0">Record</button>
                                </div>
                                <Button onClick={this.props.toggleModal} color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDialog);
