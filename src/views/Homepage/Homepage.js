import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Row, Col} from "antd";
import {
  Utils,
  numeral,
  reduceAddress,
  ADDRESSES
} from "../../utils/utils";
import "./Homepage.scss";

class Homepage extends Component{
  constructor(props){
    super(props);
    this.state={
      apy:0,
    }
  }

  componentDidMount = () => {
    this.timer = setInterval(()=>{this.checkContract()}, 1000);
  }

  componentWillUnmount = () =>{
    clearInterval(this.timer);
  }

  checkContract = async ()=>{
		if(Utils.web3 &&
      Utils.ocean &&
      this.props.address ){
      clearInterval(this.timer);

      const teamBalance = await this.getOceanBalance(ADDRESSES.team);
      const marketingBalance = await this.getOceanBalance(ADDRESSES.marketing);
      const nodesBalance = await this.getOceanBalance(ADDRESSES.nodes);
      const investorsBalance = await this.getOceanBalance(ADDRESSES.investors);

      this.setState({
        teamBalance: teamBalance,
        marketingBalance: marketingBalance,
        nodesBalance: nodesBalance,
        investorsBalance: investorsBalance,
      })
		}
	}

  getOceanBalance=(addr)=>{
    return new Promise((resolve, reject)=>{
      Utils.ocean.methods.balanceOf(addr).call()
      .then(res=>{
        resolve(Utils.web3.utils.fromWei(res));
      })
      .catch(err=>{
        console.log(err);
        reject(0);
      })
    })
  }

  render(){
    return(
      <div className="homepage"  align="middle">
        <div className="bannerContainer" align="left">
          <img src={require(`../../assets/images/bg.png`)} alt="coin" width="100%"/>
          <div className="bannerInner">
            <h1>{this.props.languageFile.homepage.welcome}</h1>
            <h2>{this.props.languageFile.homepage.slogan}</h2>
            <p>{this.props.languageFile.homepage.description}</p>

            <Link to="/bank">

              <div className="button">
                {this.props.languageFile.homepage.farm}
              </div>
            </Link>

          </div>

        </div>

        <div className="bottomContainer">
          <div className="products tokenAllocation" align="middle">
            <h1>
              {this.props.languageFile.homepage.tokenAllocation}
            </h1>

            <div className="totalSupply box">
              {this.props.languageFile.homepage.totalSupply}
              <span>1,000,000,000</span>
            </div>

            <div className="box">
              <Row type="flex" justify="center" align="middle">
                <Col xs={16} sm={16} md={14}>
                  <div className="list">
                    <p>
                      <span className="dot" style={{backgroundColor:"#54E3EB"}}></span>
                      <span className="percent">50%</span>
                      <span className="name">{this.props.languageFile.homepage.mining}</span>
                    </p>
                    <p>
                      <span className="dot" style={{backgroundColor:"#494B72"}}></span>
                      <span className="percent">40%</span>
                      <span className="name">{this.props.languageFile.homepage.nodes}</span>
                    </p>
                    <p>
                      <span className="dot" style={{backgroundColor:"#FEB03C"}}></span>
                      <span className="percent">5%</span>
                      <span className="name">{this.props.languageFile.homepage.team}</span>
                    </p>
                    <p>
                      <span className="dot" style={{backgroundColor:"#FFE955"}}></span>
                      <span className="percent">4%</span>
                      <span className="name">{this.props.languageFile.homepage.investors}</span>
                    </p>
                    <p>
                      <span className="dot" style={{backgroundColor:"#45C9B5"}}></span>
                      <span className="percent">1%</span>
                      <span className="name">{this.props.languageFile.homepage.marketing}</span>
                    </p>
                  </div>

                </Col>
                <Col xs={8} sm={8} md={8}>
                  <img src={require(`../../assets/images/distribution.png`)} alt="coin" width="90%"/>
                </Col>
              </Row>
              <br/>
              <p style={{textAlign:"center"}}>{this.props.languageFile.homepage.lockInfo}</p>
            </div>

            <div className="box teamList">
              <div className="listHeader" algin="left">
                <img src={require(`../../assets/images/pieIcon.png`)} alt="coin" width="50px" className="pieIcon"/>
                <h1>
                  {this.props.languageFile.homepage.fairTransparent}
                </h1>
                <p>
                  {this.props.languageFile.homepage.fairNote}
                </p>


                <a href={`https://hecoinfo.com/token/${Utils.pools.ocean.token2Address}#balances`} target="_blank" rel="noopener noreferrer">
                  <div className="hecoInfo clickableButton">
                    <img src={require(`../../assets/images/hecoInfo.png`)} alt="coin" width="15px"/>
                    <span>{this.props.languageFile.homepage.hecoInfo}</span>
                    <img className="arrow" src={require(`../../assets/images/rightArrow.png`)} alt="coin" width="20px"/>
                  </div>
                </a>
              </div>

              <Row type="flex" justify="center" align="middle">
                <Col span={7}>
                  <div className="title">
                    <p>{this.props.languageFile.homepage.nodes}</p>
                    <p>{this.props.languageFile.homepage.team}</p>
                    <p>{this.props.languageFile.homepage.investors}</p>
                    <p>{this.props.languageFile.homepage.marketing}</p>
                  </div>
                </Col>
                <Col span={7}>
                  <div className="address">
                    <p>
                      <a href={`https://hecoinfo.com/token/${ADDRESSES.ocean}?a=${ADDRESSES.nodes}`} target="_blank" rel="noopener noreferrer">
                        {reduceAddress(ADDRESSES.nodes)}
                      </a>
                    </p>
                    <p>
                      <a href={`https://hecoinfo.com/token/${ADDRESSES.ocean}?a=${ADDRESSES.team}`} target="_blank" rel="noopener noreferrer">
                        {reduceAddress(ADDRESSES.team)}
                      </a>
                    </p>
                    <p>
                      <a href={`https://hecoinfo.com/token/${ADDRESSES.ocean}?a=${ADDRESSES.investors}`} target="_blank" rel="noopener noreferrer">
                        {reduceAddress(ADDRESSES.investors)}
                      </a>
                    </p>
                    <p>
                      <a href={`https://hecoinfo.com/token/${ADDRESSES.ocean}?a=${ADDRESSES.marketing}`} target="_blank" rel="noopener noreferrer">
                        {reduceAddress(ADDRESSES.marketing)}
                      </a>
                    </p>
                  </div>
                </Col>
                <Col span={3}>
                  <div className="percent">
                    <p>40%</p>
                    <p>5%</p>
                    <p>4%</p>
                    <p>1%</p>
                  </div>
                </Col>
                <Col span={7}>
                  <div className="amount">
                    <p>{numeral(this.state.nodesBalance).format("0,0")} ODT</p>
                    <p>{numeral(this.state.teamBalance).format("0,0")} ODT</p>
                    <p>{numeral(this.state.investorsBalance).format("0,0")} ODT</p>
                    <p>{numeral(this.state.marketingBalance).format("0,0")} ODT</p>
                  </div>
                </Col>
              </Row>

              <div className="poolContractAddress">
                <div className="listHeader" algin="left">
                  <h1>
                    {this.props.languageFile.homepage.contractPool}
                  </h1>

                </div>
                <Row type="flex" justify="center" align="middle">
                  <Col span={8}>
                    <div className="title">
                      <p>ODT-HBTC-LP</p>
                      <p>ODT-HT-LP</p>
                      <p>ODT-USDT-LP</p>
                      <p>ODT</p>
                      <p>USDT</p>
                    </div>
                  </Col>
                  <Col span={9}>
                    <div className="address">
                      <p>
                        <a href={`https://hecoinfo.com/token/${ADDRESSES.ocean}?a=${ADDRESSES.btc1ocean2oceanPool}`} target="_blank" rel="noopener noreferrer">
                          {reduceAddress(ADDRESSES.btc1ocean2oceanPool)}
                        </a>
                      </p>
                      <p>
                        <a href={`https://hecoinfo.com/token/${ADDRESSES.ocean}?a=${ADDRESSES.ht1ocean2oceanPool}`} target="_blank" rel="noopener noreferrer">
                          {reduceAddress(ADDRESSES.ht1ocean2oceanPool)}
                        </a>
                      </p>
                      <p>
                        <a href={`https://hecoinfo.com/token/${ADDRESSES.ocean}?a=${ADDRESSES.usdt1ocean2oceanPool}`} target="_blank" rel="noopener noreferrer">
                          {reduceAddress(ADDRESSES.usdt1ocean2oceanPool)}
                        </a>
                      </p>
                      <p>
                        <a href={`https://hecoinfo.com/token/${ADDRESSES.ocean}?a=${ADDRESSES.ocean2oceanPool}`} target="_blank" rel="noopener noreferrer">
                          {reduceAddress(ADDRESSES.ocean2oceanPool)}
                        </a>
                      </p>
                      <p>
                        <a href={`https://hecoinfo.com/token/${ADDRESSES.ocean}?a=${ADDRESSES.usdt2oceanPool}`} target="_blank" rel="noopener noreferrer">
                          {reduceAddress(ADDRESSES.usdt2oceanPool)}
                        </a>
                      </p>
                    </div>
                  </Col>

                  <Col span={7}>
                    <div className="amount">
                      <p>
                        <a href={`https://hecoinfo.com/address/${ADDRESSES.btc1ocean2oceanPool}#code`} target="_blank" rel="noopener noreferrer">
                          {this.props.languageFile.homepage.openContract}
                        </a>
                      </p>
                      <p>
                        <a href={`https://hecoinfo.com/address/${ADDRESSES.ht1ocean2oceanPool}#code`} target="_blank" rel="noopener noreferrer">
                          {this.props.languageFile.homepage.openContract}
                        </a>
                      </p>
                      <p>
                        <a href={`https://hecoinfo.com/address/${ADDRESSES.usdt1ocean2oceanPool}#code`} target="_blank" rel="noopener noreferrer">
                          {this.props.languageFile.homepage.openContract}
                        </a>
                      </p>
                      <p>
                        <a href={`https://hecoinfo.com/address/${ADDRESSES.ocean2oceanPool}#code`} target="_blank" rel="noopener noreferrer">
                          {this.props.languageFile.homepage.openContract}
                        </a>
                      </p>
                      <p>
                        <a href={`https://hecoinfo.com/address/${ADDRESSES.usdt2oceanPool}#code`} target="_blank" rel="noopener noreferrer">
                          {this.props.languageFile.homepage.openContract}
                        </a>
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>

          <div className="products" align="middle">
            <h1>
              {this.props.languageFile.homepage.products}
            </h1>
            <Row type="flex" justify="space-around" align="middle">
              <Col xs={24} sm={24} md={7}>
                <Row type="flex" justify="space-around" align="middle" gutter={16} className="productBox">
                  <Col span={8}>
                    <img src={require(`../../assets/images/fish.png`)} alt="coin" width="70%"/>
                  </Col>
                  <Col span={16}>
                    <div>
                      <h2>OceanDao</h2>
                      <p>{this.props.languageFile.homepage.oceanDaoInfo}</p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={7}>
                <Row type="flex" justify="space-around" align="middle" gutter={16}  className="productBox">
                  <Col span={8}>
                    <img src={require(`../../assets/images/crab.png`)} alt="coin" width="70%"/>
                  </Col>
                  <Col span={16}>
                    <div>
                      <h2>OceanSwap</h2>
                      <p>{this.props.languageFile.homepage.oceanSwapInfo}</p>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={7}>
                <Row type="flex" justify="space-around" align="middle" gutter={16}  className="productBox">
                  <Col span={8}>
                    <img src={require(`../../assets/images/star.png`)} alt="coin" width="70%"/>
                  </Col>
                  <Col span={16}>
                    <div>
                      <h2>OceanLab</h2>
                      <p>{this.props.languageFile.homepage.oceanLabInfo}</p>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </div>


      </div>
    )
  }
}

export default Homepage;
