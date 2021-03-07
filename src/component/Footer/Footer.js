import React, {Component} from 'react';
import {Utils} from '../../utils/utils';
import "./Footer.scss";
class Footer extends Component{
  render(){

    // 推特：https://twitter.com/OceanFinance2
    // 电报：https://t.me/oceanfinance1
    // Medium：https://link.medium.com/kWnlcFmc7db
    // 公众号：OceanFinance

    return(
        <div className="footer" align="middle">

          <a href={"https://t.me/oceandaofinance"} target="_blank" rel="noopener noreferrer">
            Telegram
            {/* <img src={require("../../assets/images/twitter.png")} alt="bg" width="30px"/> */}
          </a>
          <a href={"/"}>
            Twitter
            {/* <img src={require("../../assets/images/twitter.png")} alt="bg" width="30px"/> */}
          </a>
          <a href={"/"}>
            Medium
            {/* <img src={require("../../assets/images/medium.png")} alt="bg" width="30px"/> */}
          </a>
          <a href={"https://github.com/oceanswap/ocean-core/tree/audit"}  target="_blank" rel="noopener noreferrer">
            Github
            {/* <img src={require("../../assets/images/github.png")} alt="bg" width="30px"/> */}
          </a>
          <a href={`https://ht.mdex.com/#/swap?inputCurrency=${Utils.pools.ocean.token1Address}&outputCurrency=${Utils.pools.ocean.token2Address}`} target="_blank" rel="noopener noreferrer">
            {this.props.languageFile.footer.buy} OCEAN
          </a>
        </div>

    )
  }
}

export default Footer;
