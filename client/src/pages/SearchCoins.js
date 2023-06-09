import React, { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

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
  });

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
      <Container>
        <Row>
          {searchedCoins.map((coin) => {
            return (
              <Col key={coin.coinId} md="4">
                <Card border="dark">
                  {coin.image ? (
                    <Card.Img src={coin.image} variant="top" />
                  ) : null}
                  <Card.Body>
                    <p className="small">Token: {coin.symbol}</p>
                    <Card.Text>{coin.coinId}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedCoinIds?.some(
                          (savedCoinId) => savedCoinId === coin.coinId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveCoin(coin.coinId)}
                      >
                        {savedCoinIds?.some(
                          (savedCoinId) => savedCoinId === coin.coinId
                        )
                          ? "This coin has already been saved!"
                          : "Save this Coin!"}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchCoins;
