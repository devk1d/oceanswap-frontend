import React, { Component } from 'react';
import Header  from "./component/Header/Header.js";
import Footer  from "./component/Footer/Footer.js";
import Routes from "./routes";
import Web3 from 'web3';
import {Utils} from './utils/utils';
import './App.scss';

let defaultLang = sessionStorage.getItem('lang') || 'en';
class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			curNetwork: "Login",
			lang:"en",
			address: null,
			languageFile: require('./assets/languages/'+defaultLang+'.json')
		}
	}

	//change language selection and set it to sessionStorage
	changeLang = () => {
		let value = "en";
		if(this.state.lang === "en"){
			value = "zh_CN"
		}
		else{
			value = "en"
		}

		this.setState({
			lang: value
		}, ()=>{
			sessionStorage.lang = this.state.lang;
			this.getInitialState();

		})
	}

	//read language selection from sessionStorage
	getInitialState(){
		var currentLang = sessionStorage.getItem('lang') || 'en';

		sessionStorage.lang = currentLang;

		this.setState({
			lang: currentLang,
			languageFile: require('./assets/languages/'+currentLang+'.json')
		});
	}


	readWeb3Instance = () =>{
		let newWeb3 = null;
		if (typeof window.ethereum !== 'undefined') {
			window.ethereum.enable();
			newWeb3 = new Web3(window.ethereum);

			this.checkChainId(newWeb3);

			newWeb3.eth.getAccounts()
			.then(res=>{
				this.setState({
					address: res[0]
				})
			})
			.catch(err=>{
				console.log(err);
			})
			Utils.setWeb3(newWeb3);
		}
		else if (typeof window.web3 !== 'undefined') {
			newWeb3 = new Web3(window.web3.currentProvider);
			this.checkChainId(newWeb3);
			if(newWeb3.eth.defaultAccount){
				this.setState({
					address: newWeb3.eth.defaultAccount
				},()=>{
					Utils.setWeb3(newWeb3);
				})
			}
			else{
				newWeb3.eth.getAccounts()
				.then(res=>{
					this.setState({
						address: res[0]
					})
				})
				.catch(err=>{
					console.log(err);
				})
				Utils.setWeb3(newWeb3);
			}

		}
		else {
			console.error('wait for MetaMask');
			setTimeout(async () => {
				await this.readWeb3Instance();
			}, 1000);
		}
	}

	checkChainId = (web3) =>{
		web3.eth.net.getId()
		.then(res=>{
			if(res === 128){
				this.setState({
					curNetwork:"HECO"
				})
			}
			else if(res === 56){
				this.setState({
					curNetwork:"BSC"
				})
			}

		})
		.catch((err) => {
			console.log(err);
		})
	}
	async componentDidMount() {
		this.getInitialState();
		this.readWeb3Instance();

		if (typeof window.ethereum !== 'undefined') {
			window.ethereum.on('accountsChanged', (accounts)=>{
				this.readWeb3Instance();
			})
			window.ethereum.on('chainChanged', (accounts)=>{
				this.readWeb3Instance();
			})
		}
		else if (typeof window.web3 !== 'undefined') {
			console.log(window.web3);
		}
	}

	render() {
		return (
			<div className="App" align="middle">
				<Header
					curNetwork = {this.state.curNetwork}
					lang={this.state.lang}
					changeLang={this.changeLang}
					languageFile={this.state.languageFile}
					address={this.state.address}/>
				<Routes
					lang={this.state.lang}
					changeLang={this.changeLang}
					languageFile={this.state.languageFile}
					address={this.state.address}/>
				<Footer
					lang={this.state.lang}
					languageFile={this.state.languageFile}
					changeLang={this.changeLang}
					/>
			</div>
		);
	}
}

export default App;
