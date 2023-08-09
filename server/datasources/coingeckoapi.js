const { RESTDataSource } = require("@apollo/datasource-rest");

class CoinGeckoAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.coingecko.com/api/v3/";
  }

  async getCoinList(page) {
    console.log("fetching coinlist...");
    try {
      const response = await this.get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=${page}&sparkline=false&locale=en`
      );

      return response.map((coin) => ({
        cursor: coin.id,
        node: {
          coinId: coin.id,
          name: coin.name,
          ath: coin.ath,
          image: coin.image,
          current_price: coin.current_price,
          symbol: coin.symbol,
          market_cap: coin.market_cap,
        },
      }));
    } catch (error) {
      // Handle the error appropriately
      console.error("Error occurred while fetching API coins:", error);
      return []; // Return an empty array or a default value as desired
    }
  }

  async getTotalCoins() {
    try {
      const response = await this.get(
        `https://api.coingecko.com/api/v3/coins/list`
      );
      return response.map((coin) => ({
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
      }));
    } catch (error) {
      // Handle the error appropriately
      console.error("Error occurred while fetching total coins:", error);
      return []; // Return an empty array or a default value as desired
    }
  }

  coinReducer(coin) {
    return {
      coinId: coin.id,
      current_price: coin.current_price,
      image: coin.image,
      symbol: coin.symbol,
      ath: coin.ath,
      market_cap: coin.market_cap,
    };
  }
}

module.exports = CoinGeckoAPI;
