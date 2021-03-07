import React, {Component} from 'react';
import {numeral} from "../../utils/utils";
import BankCard from './BankCard';
// import Countdown from '../../component/Countdown/countdown';/
import "./Bank.scss";

class Bank extends Component{
  render(){
    return(
      <div className="bank" align="middle">
        <div className="greating">
          <h1>{this.props.languageFile.bank.bankNote}</h1>

          {/* {
          checkTime(POOL_START_TIME) ? */}

          <h2>{this.props.languageFile.bank.tvl} ${numeral(this.props.state.tvl).format("0,0.[00]")}</h2>

          {/* :

            <Countdown date={POOL_START_TIME}/>
          } */}

        </div>

        <div className="bankList">
          <BankCard
            id="oceanBtcLp"
            oceanPrice = {this.props.state.oceanPrice}
            tvl = {this.props.state.btcLpTvl}
            address = {this.props.address}
            tokenStaked = {this.props.state.totalBtcLpStaked}
            languageFile={this.props.languageFile}
          />

          <BankCard
            id="oceanHtLp"
            oceanPrice = {this.props.state.oceanPrice}
            tvl = {this.props.state.htLpTvl}
            address = {this.props.address}
            tokenStaked = {this.props.state.totalHtLpStaked}
            languageFile={this.props.languageFile}
          />

          <BankCard
            id="oceanUsdtLp"
            oceanPrice = {this.props.state.oceanPrice}
            tvl = {this.props.state.usdtLpTvl}
            address = {this.props.address}
            tokenStaked = {this.props.state.totalUsdtLpStaked}
            languageFile={this.props.languageFile}
          />

          <BankCard
            id="ocean"
            oceanPrice = {this.props.state.oceanPrice}
            tvl = {this.props.state.oceanTvl}
            address = {this.props.address}
            tokenStaked = {this.props.state.totalOceanStaked}
            languageFile={this.props.languageFile}
          />

          <BankCard
            id="usdt"
            oceanPrice = {this.props.state.oceanPrice}
            tvl = {this.props.state.usdtTvl}
            address = {this.props.address}
            tokenStaked = {this.props.state.totalUsdtStaked}
            languageFile={this.props.languageFile}
          />


        </div>
      </div>
    )
  }
}

export default Bank;
