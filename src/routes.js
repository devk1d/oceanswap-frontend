import React, {Component} from 'react';
import {Switch, Route, HashRouter} from "react-router-dom";
import Homepage from "./views/Homepage/Homepage";
import Bank from "./views/Bank/Bank";
import Stake from "./views/Stake/Stake";
import {
  Utils,
  ADDRESSES
} from './utils/utils';
class Routes extends Component {
  constructor(props) {
		super(props);

		this.state = {
			usdtPrice: 1,
      htPrice: 0,
      oceanPrice: 0,
      hboPrice: 0,
      mdxPrice: 0,
      bkkLpTvl: 0
		}
	}

  async componentDidMount() {
    this.timer = setInterval(()=>{this.checkContract()}, 1000);
  }

  checkContract=()=>{
    if(Utils.web3 &&
      this.props.address &&
      Utils.ocean &&
      Utils.wht &&
      Utils.usdt &&
      Utils.btc &&
      Utils.ocean_ocean_pool &&
      Utils.usdt_ocean_pool &&
      Utils.oceanBtcLp_ocean_pool &&
      Utils.oceanHtLp_ocean_pool &&
      Utils.oceanUsdtLp_ocean_pool){
        clearInterval(this.timer);
        this.getHtBalance();
        this.getTokenPrice();
      }
      else if(Utils.web3 && this.state.address){
        clearInterval(this.timer);
        this.getHtBalance();
      }
    }

    getHtBalance=()=>{
      if(this.state.address){
        Utils.web3.eth.getBalance(this.state.address)
        .then( (res)=>{
          this.setState({
            htBalance: Utils.web3.utils.fromWei(res),
          })
        })
        .catch(console.log)
      }
    }

    getTokenPrice = () =>{
      this.get_ocean_price();
      this.get_ocean2ht_lp_price();
      this.get_ocean2usdt_lp_price();
      this.get_ocean2btc_lp_price();
      this.get_total_usdt_staked();
      this.updateTvl();
      this.timeoutTimer = setTimeout(()=>{
        this.getTokenPrice();
      }, 6100);
    }


    render(){
      // console.log(this.state.oceanPrice);
      // console.log(this.state.oceanTvl,this.state.htLpTvl,this.state.usdtLpTvl,this.state.hboLpTvl,this.state.mdxLpTvl,this.state.bkkLpTvl)
      return(
        <HashRouter>

          <Switch>

            <Route exact path="/" render={()=>(<Homepage
              lang = {this.props.lang}
              languageFile={this.props.languageFile}
              address={this.props.address}/>)}
            />

            <Route exact path="/bank" render={()=>(<Bank
              languageFile={this.props.languageFile}
              address={this.props.address}
              state={this.state}
              />)}
            />
            <Route exact path="/bank/OCEAN_BTC_LP" render={()=>(<Stake
              id={'oceanBtcLp'}
              languageFile={this.props.languageFile}
              address={this.props.address}/>)}/>

            <Route exact path="/bank/OCEAN_HT_LP" render={()=>(<Stake
              id={'oceanHtLp'}
              languageFile={this.props.languageFile}
              address={this.props.address}/>)}/>

            <Route exact path="/bank/OCEAN_USDT_LP" render={()=>(<Stake
              id={'oceanUsdtLp'}
              languageFile={this.props.languageFile}
              address={this.props.address}/>)}/>

            <Route exact path="/bank/OCEAN" render={()=>(<Stake
              id={'ocean'}
              languageFile={this.props.languageFile}
              address={this.props.address}/>)}/>

            <Route exact path="/bank/USDT" render={()=>(<Stake
              id={'usdt'}
              languageFile={this.props.languageFile}
              address={this.props.address}/>)}/>

            <Route render={()=>(<Homepage
              lang = {this.props.lang}
              languageFile={this.props.languageFile}
              address={this.props.address}/>)}/>

          </Switch>
      </HashRouter>
    )
  }

  get_ocean_price = async () =>{
    const oceanPrice = await this.get_token_Price("ocean", ADDRESSES.usdt2oceanPairAddr)
    this.setState({
      oceanPrice:oceanPrice
    },()=>{
      this.get_total_ocean_staked();
    })
  }

  get_total_ocean_staked = () =>{
    Utils.ocean_ocean_pool.methods.totalSupply().call()
    .then(staked => {
      const stakedAmount = (parseInt(staked)/1000000000000000000);
      const oceanTvl = stakedAmount * this.state.oceanPrice;
      this.setState({
        totalOceanStaked:stakedAmount,
        oceanTvl: oceanTvl
      });
    })
    .catch(err => console.log("get_total_ocean_staked",err))
  }

  get_total_usdt_staked = () =>{
    Utils.usdt_ocean_pool.methods.totalSupply().call()
    .then(staked => {
      const stakedAmount = (parseInt(staked)/1000000000000000000);
      const usdtTvl = stakedAmount;
      this.setState({
        totalUsdtStaked:stakedAmount,
        usdtTvl: usdtTvl
      });
    })
    .catch(err => console.log("get_total_usdt_staked",err))
  }

  get_ocean2ht_lp_price = async () =>{
    const htPrice = await this.get_token_Price("wht", ADDRESSES.wht2usdtPairAddr);
    const htLpPrice = await this.getOceanLpTokenPrice("wht",htPrice ,"oceanHtLp", Utils.pools.oceanHtLp.lpPairAddress);
    this.setState({
      htLpPrice:htLpPrice
    },()=>{
      this.get_total_ocean2ht_lp_staked();
    })
  }

  get_total_ocean2ht_lp_staked = () =>{
    Utils.oceanHtLp_ocean_pool.methods.totalSupply().call()
    .then(staked => {
      const stakedAmount = (parseInt(staked)/1000000000000000000);
      const htLpTvl = stakedAmount * this.state.htLpPrice * 2;
      this.setState({
        totalHtLpStaked:stakedAmount,
        htLpTvl: htLpTvl
      });
    })
    .catch(err => console.log("get_total_ocean2ht_lp_staked",err))
  }

  get_ocean2usdt_lp_price = async () =>{
    const usdtLpPrice = await this.getOceanLpTokenPrice("usdt", 1 ,"oceanUsdtLp", Utils.pools.oceanUsdtLp.lpPairAddress);
    this.setState({
      usdtLpPrice:usdtLpPrice
    },()=>{
      this.get_total_ocean2usdt_lp_staked();
    })
  }

  get_total_ocean2usdt_lp_staked = () =>{
    Utils.oceanUsdtLp_ocean_pool.methods.totalSupply().call()
    .then(staked => {
      const stakedAmount = (parseInt(staked)/1000000000000000000);
      const usdtLpTvl = stakedAmount * this.state.usdtLpPrice * 2;
      this.setState({
        totalUsdtLpStaked:stakedAmount,
        usdtLpTvl: usdtLpTvl
      });
    })
    .catch(err => console.log("get_total_ocean2usdt_lp_staked",err))
  }

  get_ocean2btc_lp_price = async () =>{
    const btcPrice = await this.get_token_Price("btc", ADDRESSES.btc2udstPairAddr);
    const btcLpPrice = await this.getOceanLpTokenPrice("btc",btcPrice , "oceanBtcLp",Utils.pools.oceanBtcLp.lpPairAddress);
    this.setState({
      btcLpPrice:btcLpPrice
    },()=>{
      this.get_total_ocean2btc_lp_staked();
    })
  }

  get_total_ocean2btc_lp_staked = () =>{
    Utils.oceanBtcLp_ocean_pool.methods.totalSupply().call()
    .then(staked => {
      const stakedAmount = (parseInt(staked)/1000000000000000000);
      const btcLpTvl = stakedAmount * this.state.btcLpPrice * 2;
      this.setState({
        totalBtcLpStaked:stakedAmount,
        btcLpTvl: btcLpTvl
      });
    })
    .catch(err => console.log("get_total_ocean2btc_lp_staked",err))
  }

  get_token_Price = (token, usdtPairAddress) =>{
    return new Promise((resolve,reject)=>{
      Utils.usdt.methods.balanceOf(usdtPairAddress).call({
        from:this.state.address
      })
      .then(usdtBalance => {
        usdtBalance = Utils.web3.utils.fromWei(usdtBalance);
        Utils[token].methods.balanceOf(usdtPairAddress).call({
          from:this.state.address
        })
        .then(tokenBalance => {
          tokenBalance = Utils.web3.utils.fromWei(tokenBalance);
          const tokenPrice = usdtBalance / parseFloat(tokenBalance);
          resolve(tokenPrice);
        })
        .catch(err => {
          console.log(token, err);
          reject(0);
        })
      })
      .catch(err => {
        console.log(token, err);
        reject(0);
      })
    })
  }

  getOceanLpTokenPrice = (token, tokenPrice, lpContract, pairContract) =>{
    return new Promise((resolve,reject)=>{
      Utils[lpContract].methods.totalSupply().call({
  			from:this.state.address
  		})
  		.then(totalSupply => {
  			totalSupply = parseInt(totalSupply)/1000000000000000000;

        Utils[token].methods.balanceOf(pairContract).call({
          from:this.state.address
        })
        .then(tokenBalance => {
          tokenBalance = Utils.web3.utils.fromWei(tokenBalance);
          const tokenValue = parseFloat(tokenBalance)*tokenPrice;
          resolve(tokenValue/totalSupply);
        })
        .catch(err => {
          console.log(token, err);
          reject(0);
        })
  		})
  		.catch(err => console.log(token,err))


    })
  }

  updateTvl = () =>{
    const tvl = this.state.oceanTvl +
      this.state.htLpTvl +
      this.state.usdtLpTvl +
      this.state.btcLpTvl +
      this.state.usdtTvl;

      this.setState({
        tvl:tvl
      })
  }

}

export default Routes;
