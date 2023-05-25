const ccxt = require('ccxt');
const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const { Logger } = require('./logger_component');

// Initialize Crypto.com exchange object
const exchange = new ccxt.cryptocom({
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_API_SECRET',
});

// Initialize Web3 provider
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const web3 = new Web3(provider);

// Trading configuration
const minBuyAmount = 0.0000150;
const maxBuyAmount = 100000;
const sellPriceIncrease = 0.87;

// Trading function
async function executeTrade() {
  try {
    // Load markets
    await exchange.loadMarkets();

    // Get all available market symbols
    const marketSymbols = exchange.symbols;

    // Select a random market symbol
    const randomIndex = Math.floor(Math.random() * marketSymbols.length);
    const symbol = marketSymbols[randomIndex];

    // Calculate the buy amount within the specified range
    const buyAmount = BigNumber.random()
      .times(maxBuyAmount - minBuyAmount)
      .plus(minBuyAmount)
      .toFixed(8);

    // Place a buy order
    const buyOrder = await exchange.createMarketBuyOrder(symbol, buyAmount);

    // Log the buy order details
    Logger.log(`Buy order executed: Market ${symbol}, Amount: ${buyAmount}, Price: ${buyOrder.price}`);

    // Calculate the sell price
    const sellPrice = new BigNumber(buyOrder.price)
      .times(1 + sellPriceIncrease / 100)
      .toFixed(8);

    // Place a sell order
    const sellOrder = await exchange.createLimitSellOrder(symbol, buyAmount, sellPrice);

    // Log the sell order details
    Logger.log(`Sell order executed: Market ${symbol}, Amount: ${buyAmount}, Price: ${sellPrice}`);
  } catch (error) {
    Logger.error('An error occurred:', error);
  }
}

// Call the executeTrade function to start trading
executeTrade();
