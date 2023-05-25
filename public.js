const ccxt = require('ccxt');
const Web3 = require('web3');
const BigNumber = require('bignumber.js');

class PublicAPI {
  constructor() {
    // Initialize Web3 provider
    this.provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
    this.web3 = new Web3(this.provider);

    // Initialize Crypto.com exchange object
    this.exchange = new ccxt.cryptocom();
  }

  async loadMarkets() {
    try {
      await this.exchange.loadMarkets();
    } catch (error) {
      console.error('Failed to load markets:', error);
      throw error;
    }
  }

  async getBlockNumber() {
    try {
      const blockNumber = await this.web3.eth.getBlockNumber();
      return blockNumber;
    } catch (error) {
      console.error('Error retrieving block number:', error);
      throw error;
    }
  }

  async getBalance(address) {
    try {
      const balance = await this.web3.eth.getBalance(address);
      return new BigNumber(balance);
    } catch (error) {
      console.error('Error retrieving balance:', error);
      throw error;
    }
  }

  async getGasPrice() {
    try {
      const gasPrice = await this.web3.eth.getGasPrice();
      return new BigNumber(gasPrice);
    } catch (error) {
      console.error('Error retrieving gas price:', error);
      throw error;
    }
  }

  async getMarketTicker(tradingPair) {
    try {
      const ticker = await this.exchange.fetchTicker(tradingPair);
      return ticker;
    } catch (error) {
      console.error('Error retrieving market ticker:', error);
      throw error;
    }
  }

  // Add additional public methods as needed

}

module.exports = {
  PublicAPI
};
