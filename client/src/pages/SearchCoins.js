import React, { useState, useEffect } from "react";

import Auth from "../utils/auth";
import { saveCoinIds, getSavedCoinIds } from "../utils/localStorage";

import { useMutation } from "@apollo/client";
import { SAVE_COIN } from "../utils/mutations";

const SearchCoins = () => {
  // create state for holding returned google api data
  const [searchedCoins, setSearchedCoins] = useState([]);

  // create state to hold saved coinId values
  const [savedCoinIds, setSavedCoinIds] = useState(getSavedCoinIds());
  const [saveCoin] = useMutation(SAVE_COIN);

  // set up useEffect hook to save `savedCoinIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveCoinIds(savedCoinIds);
  }, [savedCoinIds]);

  // useEffect to show coins
  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=eco-friendly&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`
        );
        if (!response.ok) {
          throw new Error("something went wrong!");
        }

        const items = await response.json();
        console.log(items);

        const coinData = items.map((coin) => ({
          coinId: coin.id,
          current_price: coin.current_price,
          image: coin.image,
          symbol: coin.symbol,
        }));

        setSearchedCoins(coinData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoinData();
  }, []);

  // create function to handle saving a coin to our database
  const handleSaveCoin = async (coinId) => {
    // find the coin in `searchedCoins` state by the matching id
    let coinToSave = searchedCoins.find((coin) => coin.coinId === coinId);
    // Ensure `current_price` is an integer
    coinToSave.current_price = parseInt(coinToSave.current_price);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      await saveCoin({
        variables: {
          content: { ...coinToSave },
        },
      });

      // if coin successfully saves to user's account, save coin id to state
      setSavedCoinIds([coinToSave.coinId, ...savedCoinIds]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="py-10">
          <div className="container mx-auto text-center">
            <p className="text-3xl inline-block p-2 rounded-full text-sky-900 border-sky-900 border-2">
              Eco Coin Portal
            </p>
          </div>
          <p className="text-center text-xl">
            The first website promoting support for Eco-friendly Cryptocurrency.
          </p>
          <p className="text-center text-xl">
            Login and save coins to your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {searchedCoins.map((coin) => (
            <div key={coin.coinId} className="flex justify-center">
              <div className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between">
                {coin.image && (
                  <img src={coin.image} alt={coin.title} className="mb-4" />
                )}
                <h4>{coin.title}</h4>
                <p className="text-sm">Token: {coin.symbol}</p>
                <p>{coin.coinId}</p>
                <div className="flex items-center justify-between">
                  <p className="mb-0">
                    Current Price: {coin.current_price.toFixed(5)}
                  </p>
                  {/* Save button */}

                  {savedCoinIds?.some(
                    (savedCoinId) => savedCoinId === coin.coinId
                  ) ? (
                    <button
                      disabled
                      className="text-white text-center mx-3 py-1 px-3 rounded-full already-saved-coin"
                    >
                      Saved
                    </button>
                  ) : (
                    <button
                      className="text-white text-center py-1 px-3 rounded-full save-new-coin"
                      onClick={() => handleSaveCoin(coin.coinId)}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchCoins;
