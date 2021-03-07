import React, {Component} from 'react';
import {Link, HashRouter} from "react-router-dom";
import {reduceAddress, numeral, Utils} from "../../utils/utils";
import { Menu, Dropdown ,message} from 'antd';
import "./Header.scss";
class Header extends Component{
  constructor(props) {
		super(props);

		this.state = {
			myOceanBalance: 0 ,
		}
	}
  async componentDidMount() {
    this.timer = setInterval(()=>{this.checkContract()}, 1000);
  }

  componentWillUnmount = () =>{
    clearInterval(this.timer);
    clearTimeout(this.timeout);
  }


  checkContract=()=>{
    if(Utils.web3 &&
      this.props.address &&
      Utils.ocean
    ){
      clearInterval(this.timer);
      this.getOceanBalance();
    }
  }

  getOceanBalance = () => {
    clearTimeout(this.timeout);
    Utils.ocean.methods.balanceOf(this.props.address).call({
      from:this.state.address
    })
    .then(oceanBalance => {
      oceanBalance = Utils.web3.utils.fromWei(oceanBalance);
      if(isNaN(oceanBalance) || parseFloat(oceanBalance) < 0.001){
        oceanBalance = 0;
      }

      this.setState({
        myOceanBalance: oceanBalance
      })
    })
    .catch(err => {
      console.log(err);
    })

    this.timeout = setTimeout(()=>{
      this.getOceanBalance();
    },10000)
  }

  render(){
    const curTab = window.location.hash;
    let selected = "home";

    if(curTab.includes("bank")){
      selected = "bank";
    }
    else if(curTab.includes("about")){
      selected = "about";
    }
    else if(curTab.includes("boardroom")){
      selected = "boardroom";
    }

    const menu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href={require(`../../assets/noneage${this.props.lang}.pdf`)}>
            {this.props.languageFile.header.noneage}
          </a>
        </Menu.Item>
        <Menu.Item >
          {/*<a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">*/}
            {this.props.languageFile.header.certiK}
          {/*</a>*/}
        </Menu.Item>
        <Menu.Item >
          {/*<a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">*/}
            {this.props.languageFile.header.slowMist}
          {/*</a>*/}
        </Menu.Item>
      </Menu>
    );

    return(
      <HashRouter>
        <div className="header">
          <div className="innerDiv">
            <img src={require("../../assets/images/logo.png")} alt="logo" width="100%" className="logo"/>
            <img src={require("../../assets/images/ocean.png")} alt="logo" width="100%" className="mobileLogo"/>
            <div className="tabDiv" algin="middle">
              <div className="tabs" algin="middle">
                <Link to="/">
                  <p className={selected === "home" ? "selectedTab clickableButton" : "clickableButton"}>{this.props.languageFile.header.home}</p>
                </Link>
                <Link to="/bank">
                  <p className={selected === "bank" ? "selectedTab clickableButton" : "clickableButton"}>{this.props.languageFile.header.bank}</p>
                </Link>
                <p onClick={()=>{message.info(this.props.languageFile.message.comingSoon)}}>
                  IDO
                </p>
                <Dropdown overlay={menu} placement="bottomCenter" arrow>
                  <p>{this.props.languageFile.header.audit}</p>
                </Dropdown>
              </div>
            </div>

            <div className="walletBar" align="right">
              <div className="falBalance">
                {numeral(this.state.myOceanBalance).format("0,0.[000]")} &nbsp;
                <img src={require("../../assets/images/ocean.png")} alt="logo" width="20px"/>
              </div>
              <div className="walletInfo">
                {this.props.curNetwork}
                <span className="address">
                  {this.props.address === null ?
                    this.props.languageFile.header.connectToWallet
                    :
                    reduceAddress(this.props.address)
                  }
                </span>
              </div>
            </div>

            <div className="changeLang" align="right"  onClick={()=>{this.props.changeLang()}}>
              <span className="clickableButton">
              {
                this.props.lang === "en"?
                "CN"
                :
                "EN"
              }
              </span>
            </div>
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default Header;
