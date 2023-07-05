const { RESTDataSource } = require("@apollo/datasource-rest");

class CoinGeckoAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.coingecko.com/api/v3/";
  }

  async getCoinList({ coinId }) {
    const response = await this.get(`coins/list`);
    return this.coinReducer(response[0]);
  }

  async getTotalCoins({ coinId }) {
    const response = await this.get(`coins/${coinId}`);
    return response.length;
  }

  async getAPICoins(offset, limit) {
    try {
      const response = await this.get(
        `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${offset}&sparkline=false&locale=en`
      );

      return Array.isArray(response)
        ? response.map((coin) => this.coinReducer(coin))
        : [];
    } catch (error) {
      // Handle the error appropriately
      console.error("Error occurred while fetching API coins:", error);
      return []; // Return an empty array or a default value as desired
    }
  }

  coinReducer(coin) {
    // const { __typename, ...data } = coin;
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
