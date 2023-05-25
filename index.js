const Web3 = require('web3');
const ccxt = require('ccxt');
const fs = require('fs');

// Initialize Web3 provider
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
const web3 = new Web3(provider);

// Initialize Crypto.com exchange object
const exchange = new ccxt.cryptocom({
  apiKey: 'YOUR_API_KEY',
  secret: 'YOUR_API_SECRET',
  // Add any additional required authentication parameters
});

// Configure trading parameters
const tradeAmount = 0.01; // Example trade amount

// Start the trading bot
async function startBot() {
  try {
    // Connect to the Crypto.com exchange
    await exchange.loadMarkets();

    // Get the available trading pairs
    const tradingPairs = exchange.symbols;

    // Loop through each trading pair
    for (const tradingPair of tradingPairs) {
      // Get the account balances
      const accountBalance = await exchange.fetchBalance();

      // Get the available balance for the base currency of the trading pair
      const baseCurrency = exchange.markets[tradingPair].base;
      const availableBalance = accountBalance.free[baseCurrency];

      if (availableBalance >= tradeAmount) {
        // Perform the trade
        const marketOrder = await exchange.createMarketSellOrder(tradingPair, tradeAmount);

        // Log the trade details
        const logMessage = `Trade executed: Sold ${tradeAmount} ${tradingPair} at ${marketOrder.price}`;
        console.log(logMessage);
        fs.appendFileSync('trade_log.txt', logMessage + '\n');
      } else {
        console.log(`Insufficient balance for trading ${tradingPair}`);
      }
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Call the startBot function to begin trading
startBot();
