const Home = () => {
  return (
    <article className="min-h-screen min-w-screen">
      <div className="bg-gradient-to-r from-green-400 to-green-600">
        <div className="container mx-auto text-center py-3">
          <p className="text-3xl inline-block p-2 rounded-full text-sky-900 border-sky-900 border-2">
            Eco Crypto Portal
          </p>
        </div>
        <h2 className="bg-gray-100 bg-opacity-75 p-4 rounded-lg">
          <p className="text-blue-500 text-center font-serif">
            Welcome to the EcoCryptoPortal! Find all the crypto currencies that
            are run by proof-of-stake (PoS)!
          </p>
          <div className="flex items-center justify-center h-screen">
            <div className="coin">
              <div className="coin-inner">
                <div className="coin-front">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    className="animate-spin-fast"
                  >
                    <g transform="rotateX(60deg)">
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="#ccc"
                        stroke="#000"
                        strokeWidth="2"
                      />
                      <circle cx="100" cy="100" r="60" fill="#fff" />
                      <circle cx="100" cy="100" r="40" fill="#0f0" />
                      <circle cx="100" cy="100" r="25" fill="#00f" />
                    </g>
                  </svg>
                </div>
                <div className="coin-back">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    className="animate-spin-fast"
                  >
                    <g transform="rotateX(60deg)">
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="#ccc"
                        stroke="#000"
                        strokeWidth="2"
                      />
                      <circle cx="100" cy="100" r="60" fill="#fff" />
                      <circle cx="100" cy="100" r="40" fill="#0f0" />
                      <circle cx="100" cy="100" r="25" fill="#00f" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </h2>
      </div>
    </article>
  );
};

export default Home;
