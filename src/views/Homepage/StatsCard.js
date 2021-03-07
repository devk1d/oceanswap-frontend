import React, {Component} from 'react';
import {BridgeTokens} from "../../utils/utils";
import "./StatsCard.scss";

const numeral = require("numeral");
class StatsCard extends Component{
  constructor(props){
    super(props);
    this.state={
      coinPrice:0,
      totalSupply:0
    }
  }
  render(){
    const token = BridgeTokens[this.props.id];
    return(
      <div className="statsCard" align="middle">

        <div className="topBar" align="left">
          <img src={require(`../../assets/images/${this.props.id}.png`)} alt="coin" width="50px"/>
          <h2 style={{color:token.color}}>{token.name}</h2>
        </div>

        <div className="dataSets" align="left">

          <p style={{color:token.color}}>{this.props.languageFile.homepage.statsCard.currentPrice}</p>
          <h1 style={{color:"rgba(37, 186, 79, 1)"}}>{numeral(this.props.coinPrice).format("$0,0.[0000]")}</h1>

          <p style={{color:token.color}}>{this.props.languageFile.homepage.statsCard.totalSupply}</p>
          <a href={`https://scan.hecochain.com/address/${token.address}#contracts`} target="_blank" rel="noopener noreferrer" >
            <h1>{numeral(this.state.totalSupply).format("0,0")}</h1>
          </a>
        </div>
      </div>
    )
  }
}

export default StatsCard;
