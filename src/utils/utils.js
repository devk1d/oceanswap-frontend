const IERC20_ABI = require("./contracts/IERC20_ABI.json");
const POOL_ABI = require("./contracts/POOL_ABI.json");

export const ADDRESSES = require("./ADDRESSES.json");

export const Utils = {
    web3: false,

    pools:{
      ocean:{
        name: "OCEAN",
        img: "ocean.png",
        lpPairAddress:ADDRESSES.usdt2oceanPairAddr,
        poolContractAddress:ADDRESSES.ocean2oceanPool,
        contract:"ocean_ocean_pool",
        token1Address:ADDRESSES.usdt,
        token2Address:ADDRESSES.ocean,
        v2:false,
        path: "OCEAN",
        status: true
      },

      usdt:{
        name: "USDT",
        img: "usdt.png",
        poolContractAddress:ADDRESSES.usdt2oceanPool,
        contract:"usdt_ocean_pool",
        token1Address:ADDRESSES.usdt,
        token2Address:ADDRESSES.ocean,
        v2:false,
        path: "USDT",
        status: true
      },

      oceanHtLp:{
        name: "OCEAN-HT-LP",
        img: "ht.png",
        lpPairAddress:ADDRESSES.ht2oceanPairAddr,
        poolContractAddress:ADDRESSES.ht1ocean2oceanPool,
        contract:"oceanHtLp_ocean_pool",
        token1Address:"HT",
        token2Address:ADDRESSES.ocean,
        v2:true,
        path: "OCEAN_HT_LP",
        status: true
      },
      oceanUsdtLp:{
        name: "OCEAN-USDT-LP",
        img: "usdt.png",
        lpPairAddress:ADDRESSES.usdt2oceanPairAddr,
        poolContractAddress:ADDRESSES.usdt1ocean2oceanPool,
        contract:"oceanUsdtLp_ocean_pool",
        token1Address:ADDRESSES.usdt,
        token2Address:ADDRESSES.ocean,
        v2:true,
        path: "OCEAN_USDT_LP",
        status: true
      },

      oceanBtcLp:{
        name: "OCEAN-HBTC-LP",
        img: "btc.png",
        lpPairAddress:ADDRESSES.btc2oceanPairAddr,
        poolContractAddress:ADDRESSES.btc1ocean2oceanPool,
        contract:"oceanBtcLp_ocean_pool",
        token1Address:ADDRESSES.btc,
        token2Address:ADDRESSES.ocean,
        v2:true,
        path: "OCEAN_BTC_LP",
        status: true
      },
    },

    async setWeb3(web3) {
        this.web3 = web3;

        this.ocean =  new web3.eth.Contract(IERC20_ABI.abi, ADDRESSES.ocean);
        this.ocean_ocean_pool = new web3.eth.Contract(POOL_ABI.abi, ADDRESSES.ocean2oceanPool);

        this.wht = new web3.eth.Contract(IERC20_ABI.abi, ADDRESSES.ht);
        this.oceanHtLp =  new web3.eth.Contract(IERC20_ABI.abi, ADDRESSES.ht2oceanPairAddr);
        this.oceanHtLp_ocean_pool = new web3.eth.Contract(POOL_ABI.abi, ADDRESSES.ht1ocean2oceanPool);

        this.usdt = new web3.eth.Contract(IERC20_ABI.abi, ADDRESSES.usdt);
        this.oceanUsdtLp =  new web3.eth.Contract(IERC20_ABI.abi, ADDRESSES.usdt2oceanPairAddr);
        this.oceanUsdtLp_ocean_pool = new web3.eth.Contract(POOL_ABI.abi, ADDRESSES.usdt1ocean2oceanPool);
        this.usdt_ocean_pool = new web3.eth.Contract(POOL_ABI.abi, ADDRESSES.usdt2oceanPool);

        this.btc = new web3.eth.Contract(IERC20_ABI.abi, ADDRESSES.btc);
        this.oceanBtcLp =  new web3.eth.Contract(IERC20_ABI.abi, ADDRESSES.btc2oceanPairAddr);
        this.oceanBtcLp_ocean_pool = new web3.eth.Contract(POOL_ABI.abi, ADDRESSES.btc1ocean2oceanPool);
    }
};


export const DAY = 86400;
export const POOL_START_TIME = 'Mon Feb 28 2021 8:00:00 UTC';

export const checkTime = (time=POOL_START_TIME) => {
  // return true;
  let now = (new Date()).getTime()/1000;
  let deadline = (new Date(time)).getTime()/1000;
  if(now >= deadline){
    return true;
  }
  return false;
}

export const reduceAddress = (addr) =>{
  if(addr){
    return addr.substring(0,7) + "..." + addr.substring(addr.length - 5,addr.length);
  }
}

export const numeral = require("numeral");
