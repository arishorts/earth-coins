// import React, { useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";

import Auth from "../utils/auth";
import { removeCoinId } from "../utils/localStorage";

import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_COIN } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

const SavedCoins = () => {
  // create state to hold saved coinId values
  const { loading, data: userData } = useQuery(QUERY_ME);
  // Check if data is returning from the `QUERY_ME` query, then the `QUERY_SINGLE_PROFILE` query
  const profile = userData?.me || {};
  const [removeCoin] = useMutation(REMOVE_COIN, {
    update(cache, { data: { removeCoin } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME });
        cache.writeQuery({
          query: QUERY_ME,
          data: {
            me: {
              ...me,
              savedCoins: me.savedCoins.filter(
                (coin) => coin.coinId !== removeCoin.coinId
              ),
            },
          },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  // create function that accepts the coin's mongo _id value as param and deletes the coin from the database
  const handleDeleteCoin = async (coinId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeCoin({
        variables: { coinId },
      });

      // upon success, remove coin's id from localStorage
      removeCoinId(coinId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <div class="py-10">
        <Container class="flex justify-content-center">
          <p class="text-3xl p-2 rounded-full text-sky-900 border-sky-900 border-2">
            Viewing saved coins!
          </p>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {profile?.coinCount
            ? `Viewing ${profile.coinCount} saved ${
                profile.coinCount === 1 ? "coin" : "coins"
              }:`
            : "You have no saved coins!"}
        </h2>
        <Row>
          {profile?.savedCoins &&
            profile.savedCoins.map((coin) => {
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
                      <p className="small">Token: {coin.symbol}</p>
                      <Card.Text>{coin.coinId}</Card.Text>
                      <Button
                        className="btn-block btn-danger"
                        onClick={() => handleDeleteCoin(coin.coinId)}
                      >
                        Delete this Coin!
                      </Button>
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

export default SavedCoins;
