import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Utils} from "../../utils/utils";
// import Countdown from "../../component/Countdown/countdown";
import "./BankCard.scss";

const numeral = require('numeral');
class FarmCard extends Component{

  constructor(props){
    super(props);
    this.state={
      apy:0,
    }
  }

  componentDidMount = () => {
    this.calcApy();
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.oceanPrice !== this.props.oceanPrice
      || prevProps.tokenStaked !== this.props.tokenStaked
    ){
      this.calcApy();
    }
  }

  calcApy = async () =>{
    if(Utils.pools[this.props.id].contract && this.props.oceanPrice > 0 && this.props.tvl > 0){
      const rewardRate = await this.getRewardRate();
      const curReward = rewardRate * 86400;
      const periodbbcValue = curReward*this.props.oceanPrice;
      let apy = periodbbcValue*365/(this.props.tvl);
      if(!isNaN(apy) && apy > 0 && apy !== Infinity){
        this.setState({
          apy:apy
        })
      }
    }
  }

  getRewardRate = () =>{
    return new Promise((resolve, reject)=>{
      Utils[Utils.pools[this.props.id].contract].methods.rewardRate()
      .call()
      .then(res=>{
        resolve(parseFloat(Utils.web3.utils.fromWei(res)));
      })
      .catch((err) => {
        reject(0);
        console.log(err);
      })
    })
  }

  render(){

    const pool = Utils.pools[this.props.id];
    return(
      <div className="bankCard" align="middle">

        <img src={require(`../../assets/images/bankImages/${pool.img}`)} alt="png" width="50px"/>
        <h2>{pool.name} </h2>
        <div className="cardNote">

          {
            this.props.tvl > 0.0001?
            <p style={{marginTop:"15px"}}>TVL <span>{numeral(this.props.tvl).format("$0,0.[000]")}</span></p>
            :
            <p style={{marginTop:"15px"}}>TVL <span>{0}</span></p>
          }

          <p>APY
            <span>
              {
                pool.status?
                numeral(this.state.apy).format("0%")
                :
                0
              }
            </span>
          </p>
        </div>


        {/* {
          !checkTime()?
            <div className="select">
          <Countdown date={POOL_START_TIME}/>
            </div>
          :
          <Link to = {`/bank/${pool.path}`} >
            <div className="select">
          {this.props.languageFile.bank.select}
            </div>
          </Link>
        } */}

        <Link to = {`/bank/${pool.path}`} >
          <div className="select">
            {this.props.languageFile.bank.select}
          </div>
        </Link>

        {
          pool.v2 ?
            <a className="link" href={`https://ht.mdex.com/#/add/${pool.token1Address}/${pool.token2Address}`} target="_blank" rel="noopener noreferrer">
                {this.props.languageFile.bank.get} {pool.name}
            </a>
          :
          <a className="link" href={`https://ht.mdex.com/#/swap?inputCurrency=${pool.token1Address}&outputCurrency=${pool.token2Address}`} target="_blank" rel="noopener noreferrer">
              {this.props.languageFile.bank.get} {pool.name}
          </a>
        }


      </div>
    )
  }
}

export default FarmCard;
