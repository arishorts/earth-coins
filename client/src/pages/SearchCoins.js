import React, { useState, useEffect } from "react";
import { Container, Col, Form, Button, Card, Row } from "react-bootstrap";

import Auth from "../utils/auth";
import { saveCoinIds, getSavedCoinIds } from "../utils/localStorage";

import { useMutation } from "@apollo/client";
import { SAVE_BOOK } from "../utils/mutations";

const SearchCoins = () => {
  // create state for holding returned google api data
  const [searchedCoins, setSearchedCoins] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState("");

  // create state to hold saved coinId values
  const [savedCoinIds, setSavedCoinIds] = useState(getSavedCoinIds());
  const [saveCoin] = useMutation(SAVE_BOOK);

  // set up useEffect hook to save `savedCoinIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveCoinIds(savedCoinIds);
  });

  // create method to search for coins and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/coins/v1/volumes?q=${searchInput}`
      );

      if (!response.ok) {
        throw new Error("something went wrong!");
      }

      const { items } = await response.json();

      const coinData = items.map((coin) => ({
        coinId: coin.id,
        authors: coin.volumeInfo.authors || ["No author to display"],
        title: coin.volumeInfo.title,
        description: coin.volumeInfo.description,
        image: coin.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedCoins(coinData);
      setSearchInput("");
    } catch (err) {
      console.error(err);
    }
  };

  // create function to handle saving a coin to our database
  const handleSaveCoin = async (coinId) => {
    // find the coin in `searchedCoins` state by the matching id
    const coinToSave = searchedCoins.find((coin) => coin.coinId === coinId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      await saveCoin({
        variables: {
          //userId: Auth.getProfile().data._id,
          //content: coinToSave,
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
      <div className="text-light bg-dark pt-5">
        <Container>
          <h1>Search for Coins!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a coin"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg">
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className="pt-5">
          {searchedCoins.length
            ? `Viewing ${searchedCoins.length} results:`
            : "Search for a coin to begin"}
        </h2>
        <Row>
          {searchedCoins.map((coin) => {
            return (
              <Col key={coin.coinId} md="4">
                <Card border="dark">
                  {coin.image ? (
                    <Card.Img
                      src={coin.image}
                      alt={`The cover for ${coin.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{coin.title}</Card.Title>
                    <p className="small">Authors: {coin.authors}</p>
                    <Card.Text>{coin.description}</Card.Text>
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
