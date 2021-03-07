import React, {Component} from 'react';
import {Modal, Input, message} from 'antd';
import {Utils} from "../../utils/utils";
import  {LoadingOutlined} from '@ant-design/icons';
import "./Stake.scss";

const numeral = require("numeral");
class Stake extends Component{
  constructor(props){
    super(props);
    this.state={
      stakeVisible:false,
      approveLoading: false,
      stakeLoading: false,
      harvestLoading: false,
      exitLoading: false,
      myTokenBalance: 0
    }
  }

  componentDidMount = () => {
    this.timer = setInterval(()=>{this.checkContract()}, 1000);
  }

  componentWillUnmount = () =>{
    clearInterval(this.timer);
    clearTimeout(this.rewardTimeout);
  }

  checkContract=()=>{
		if(Utils.web3 &&
      Utils[this.props.id] &&
      Utils.pools[this.props.id].contract &&
      Utils[Utils.pools[this.props.id].contract] &&
      this.props.address ){
      clearInterval(this.timer);
			this.getStakeData();
      this.getReward();
		}
	}

  onChangeStakeValue=(e)=>{
    this.setState({
      stakeInput:e.target.value
    })
  }

  getReward = () =>{
    clearTimeout(this.rewardTimeout);
    Utils[Utils.pools[this.props.id].contract].methods.earned(this.props.address).call()
    .then(earned => {
      let balance = Utils.web3.utils.fromWei(earned)
      let afterTaxReward = balance * (100 - this.state.withdrawFeeRate) / 100;

      this.setState({
        bbcEarned:balance,
        afterTaxReward:afterTaxReward
      });
    })
    .catch(err => console.log(err))

    this.rewardTimeout = setTimeout(()=>{
      this.getReward();
    },6100);
  }

  getStakeData = () =>{
    Utils.web3.eth.getBalance(this.props.address)
    .then(currentHtBalance => {
        this.setState({
          myHtBalance:Utils.web3.utils.fromWei(currentHtBalance)
        });
    })
    .catch(err => console.log(err))

    if(Utils[Utils.pools[this.props.id].contract]){

        Utils[this.props.id].methods.allowance(this.props.address,Utils.pools[this.props.id].poolContractAddress).call()
        .then(allowance => {

          let myallowance = Utils.web3.utils.fromWei(allowance)
          this.setState({
            allowance:myallowance
          });
        })
        .catch(err => console.log(err))

        Utils[this.props.id].methods.balanceOf(this.props.address).call()
        .then(myTokenBalance => {
          let balance = Utils.web3.utils.fromWei(myTokenBalance);
          if(isNaN(balance) || parseFloat(balance) < 0.0000001){
            balance = 0;
          }
          this.setState({
            myTokenBalance: balance
          });
        })
        .catch(err => console.log(err))


      if(Utils.pools[this.props.id].releaseTime && Utils.pools[this.props.id].genesisEndTime){
        if(this.checkTime(Utils.pools[this.props.id].genesisEndTime)){
          this.setState({
            withdrawFeeRate:10
          });
        }
      }


      Utils[Utils.pools[this.props.id].contract].methods.balanceOf(this.props.address).call()
      .then(staked => {
        let stakedAmount = Utils.web3.utils.fromWei(staked);
        if(this.props.id === "husd"){
          stakedAmount = parseInt(staked)/100000000;
        }
        this.setState({
          staked: stakedAmount
        });
      })
      .catch(err => console.log(err))
    }

  }



  render(){
    const pool = Utils.pools[this.props.id];
    let earnedToken = "OCEAN";
    let earnedImg = "ocean.png";
    return(

      <div className="stake" align="middle">
        <div className="greating">
            <h1>
              {this.props.languageFile.stake.earn}&nbsp;
               {earnedToken}&nbsp;
              {this.props.languageFile.stake.by}&nbsp;
              {pool.name}
            </h1>

            {/*<h3>
              {this.props.languageFile.stake.earn} &nbsp;
               OCEAN &nbsp;
              {this.props.languageFile.stake.byProvidingLiquidity}
            </h3>*/}
        </div>


        <div className="farmSet" align="middle">

            <div className="stakingBox">
              <img src={require(`../../assets/images/${earnedImg}`)} alt="png" width="80px"/>
              <h1>{numeral(this.state.bbcEarned).format("0,0.[0000]")}</h1>
              <p>{earnedToken} {this.props.languageFile.stake.earned}</p>
              <div
                className="button clickableButton"
                style={{color: this.state.staked>0 ? "white" : "lightGrey", cursor: this.state.staked <= 0 || !pool.status ? "not-allowed": "pointer"}}
                onClick={()=>{this.harvest()}}
                >
                {this.props.languageFile.stake.harvest}
                {this.state.harvestLoading ?
                  <LoadingOutlined />
                  :
                  null
                }
              </div>
            </div>

            <div className="stakingBox">
              <img src={require(`../../assets/images/bankImages/${pool.img}`)} alt="png" width="80px"/>
              <h1>{numeral(this.state.staked).format("0,0.[00]")}</h1>
              <p>{pool.name} {this.props.languageFile.stake.staked}</p>
              {
                this.state.allowance > 0?
                <div
                className="button clickableButton"
                onClick={()=>{
                  if(this.state.myTokenBalance === "0" || this.state.stakeLoading){
                    return ;
                  }
                  this.setState({stakeVisible:true})
                }}
                style={{cursor:this.state.approveLoading || this.state.myTokenBalance === "0" || !pool.status ? "not-allowed" : "pointer"}}
                >
                  {this.props.languageFile.stake.deposit} {pool.v2 ? "LP" : pool.name}
                  {this.state.stakeLoading ?
                    <LoadingOutlined />
                    :
                    null
                  }
                </div>
                :
                <div
                className="button clickableButton"
                onClick={()=>{this.approve()}}
                style={{cursor:this.state.approveLoading || !pool.status? "not-allowed" : "pointer"}}
                >
                  {this.props.languageFile.stake.approve} {pool.v2 ? "LP" : pool.name}
                  {this.state.approveLoading ?
                    <LoadingOutlined />
                    :
                    null
                  }
                </div>
              }

            </div>
        </div>

        <Modal
          visible={this.state.stakeVisible}
          onOk={this.handleStakeCancel}
          centered={true}
          onCancel={this.handleStakeCancel}
          footer={null}
          >
          <div align="middle" className="stakeBox">
            <h2>{this.props.languageFile.stake.deposit} {pool.name}</h2>
            <p>
              {numeral(this.state.myTokenBalance).format("0,0.000000")}
              &nbsp;{pool.name}
              &nbsp;{this.props.languageFile.stake.avaliable}</p>

            <Input
              suffix={<span>
                  <span className="unit">{pool.name}</span>
                  <span className="max" onClick={()=>{this.maxInput()}}>{this.props.languageFile.stake.max}</span>

                </span>}
              style={{ textAlign:"center", width:"100%", height:"50px"}}
              type="number"
              value={this.state.stakeInput}
              onChange={(e)=>this.onChangeStakeValue(e)}
            />
            <div className="stakeButton clickableButton" onClick={()=>{this.handleStakeCancel()}}>
              {this.props.languageFile.stake.cancel}
            </div>
            <div className="stakeButton clickableButton" onClick={()=>{this.stake()}}>
              {this.props.languageFile.stake.deposit}
            </div>
          </div>
        </Modal>

        <div
          className="button harvestAndUnstake clickableButton"
          style={{color: this.state.staked>0 ? "white" : "lightGrey", cursor: this.state.staked>0 ? "pointer" : "not-allowed"}}
          onClick={()=>{this.harvestAndUnstake()}}
          >
          {this.props.languageFile.stake.harvestAndUnstake}
          {this.state.exitLoading ?
            <LoadingOutlined />
            :
            null
          }
        </div>
      </div>
    )
  }

  maxInput = () =>{
    let amount = Math.floor(this.state.myTokenBalance);
    this.setState({
      stakeInput: amount
    })
  }


  handleStakeCancel = (e) => {
    this.setState({
      stakeVisible: false
    })
  }

  approve = () =>{
    if(this.state.approveLoading  || !Utils.pools[this.props.id].status){
      return;
    }
    if(parseFloat(this.state.myHtBalance) < 0.01){
      message.info(this.props.languageFile.stake.notification.needGasFee, 3);
      return;
    }
    if(Utils[this.props.id].methods){
      Utils[this.props.id].methods.approve(Utils.pools[this.props.id].poolContractAddress, "10000000000000000000000000000000000000000000000000").send({
        from:this.props.address
      })
      .on('transactionHash', (hash)=>{
        console.log(hash);
        this.setState({
          approveLoading:true
        })
        message.success(this.props.languageFile.stake.notification.transactionSent,3);
      })
      .then(res => {
        this.setState({
          approveLoading:false,
          stakeVisible:true
        })

        message.success(this.props.languageFile.stake.notification.transactionSuccess, 3)
        this.getStakeData();
      })
      .catch(err => console.log(err))
    }
  }

  stake = async () =>{
    if(this.state.stakeLoading || !Utils.pools[this.props.id].status){
      return;
    }
    if(parseFloat(this.state.myHtBalance) < 0.1){
      message.info(this.props.languageFile.stake.notification.needGasFee, 3);
      return;
    }

    if(parseFloat(this.state.myTokenBalance) < this.state.stakeInput){
      message.info(this.props.languageFile.stake.notification.insufficientFunds, 3);
      return;
    }

    if(this.props.id === "ht"){
      if(parseFloat(this.state.myTokenBalance) < parseFloat(this.state.stakeInput) + 0.1){
        message.info(this.props.languageFile.stake.notification.needGasFee, 3);
        return;
      }
    }


    let stakeAmount = Utils.web3.utils.toWei(this.state.stakeInput.toString());
    if(Utils[Utils.pools[this.props.id].contract].methods){

      if(this.props.id === 'husd'){
        stakeAmount = (parseFloat(this.state.stakeInput*100000000)).toString()
      }
      Utils[Utils.pools[this.props.id].contract].methods.stake(stakeAmount).send({
        from:this.props.address
      })
      .on('transactionHash', (hash)=>{
        console.log(hash);
        this.setState({
          stakeLoading:true
        })
        this.handleStakeCancel();
        message.success(this.props.languageFile.stake.notification.transactionSent,3);
      })
	    .then(res => {
        this.setState({
          stakeLoading:false
        })
        this.getStakeData();
        message.success(this.props.languageFile.stake.notification.transactionSuccess, 3)
	    })
	    .catch(err => console.log(err))

    }
  }

  harvestAndUnstake = () =>{
    if(this.state.exitLoading){
      return;
    }
    if(Utils.pools[this.props.id].releaseTime && Utils.pools[this.props.id].genesisEndTime){
      if(!this.checkTime(Utils.pools[this.props.id].genesisEndTime)){
        message.info(this.props.languageFile.stake.unstakeFreeze, 3);
        return;
      }
    }
    if(parseFloat(this.state.myHtBalance) < 0.01){
      message.info(this.props.languageFile.stake.notification.needGasFee, 3);
      return;
    }
    if(Utils[Utils.pools[this.props.id].contract].methods && this.state.staked > 0){
      Utils[Utils.pools[this.props.id].contract].methods.exit().send({
        from:this.props.address
      })
      .on('transactionHash', (hash)=>{
        console.log(hash);
        this.setState({
          exitLoading:true
        })
        message.success(this.props.languageFile.stake.notification.transactionSent,3);
      })
	    .then(res => {
        this.setState({
          exitLoading:false
        })
        this.getStakeData();
        message.success(this.props.languageFile.stake.notification.transactionSuccess, 3)
	    })
	    .catch(err => console.log(err))
    }
  }

  harvest = () =>{
    if(this.state.harvestLoading  || !Utils.pools[this.props.id].status){
      return;
    }
    if(parseFloat(this.state.myHtBalance) < 0.01){
      message.info(this.props.languageFile.stake.notification.needGasFee, 3);
      return;
    }
    if(Utils.pools[this.props.id].endTime && this.checkTime(Utils.pools[this.props.id].endTime)){
      return ;
    }
    if(this.state.bbcEarned > 0){
      if(Utils[Utils.pools[this.props.id].contract].methods){
        Utils[Utils.pools[this.props.id].contract].methods.getReward().send({
          from:this.props.address
        })
        .on('transactionHash', (hash)=>{
          console.log(hash);
          this.setState({
            harvestLoading:true
          })
          message.info(this.props.languageFile.stake.notification.transactionSent,3);
        })
        .then(res => {
          this.setState({
            harvestLoading:false
          })
          this.getStakeData();
          message.success(this.props.languageFile.stake.notification.transactionSuccess, 3)
        })
        .catch(err => console.log(err))
      }
    }
  }

}

export default Stake;
