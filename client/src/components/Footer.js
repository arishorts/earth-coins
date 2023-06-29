import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Container className="d-flex justify-content-center align-items-center">
        <p className="text-xl sm:text-3xl md:text-2xl py-1 px-2 bg-stone-700 rounded-full text-white border-stone-700 border-2">
          Powered by{" "}
          <a
            href="https://www.coingecko.com/"
            className="font-bold transition duration-400 hover:text-sky-500"
          >
            CoinGecko
          </a>
        </p>

        <a href="https://www.coingecko.com/">
          <img
            src="https://static.coingecko.com/s/thumbnail-d5a7c1de76b4bc1332e48227dc1d1582c2c92721b5552aae76664eecb68345c9.png"
            alt="CoinGecko"
            className="image-text-size"
          />
        </a>
      </Container>
    </footer>
  );
};

export default Footer;
