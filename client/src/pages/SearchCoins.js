import React, { useState, useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";
import Auth from "../utils/auth";
import { saveCoinIds, getSavedCoinIds } from "../utils/localStorage";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_COIN } from "../utils/mutations";
import { QUERY_GETAPICOINS } from "../utils/queries";

const SearchCoins = () => {
  const {
    loading,
    error,
    data: coinData,
    refetch,
  } = useQuery(QUERY_GETAPICOINS);
  const allCoins = coinData?.getAPICoins || [];

  // create state for holding returned google api data
  const [searchedCoins, setSearchedCoins] = useState([]);
  const [paginate, usePaginate] = useState([8]);
  const [currentPage, setCurrentPage] = useState([1]);

  // create state to hold saved coinId values
  const [savedCoinIds, setSavedCoinIds] = useState(getSavedCoinIds());
  const [saveCoin] = useMutation(SAVE_COIN);

  const [coinPrices, setCoinPrices] = useState({});
  // set up useEffect hook to save `savedCoinIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveCoinIds(savedCoinIds);
  }, [savedCoinIds]);

  useEffect(() => {
    if (!loading && coinData) {
      setSearchedCoins(coinData.getAPICoins);
    }
  }, [loading, coinData]);

  // create function to handle saving a coin to our database
  const handleSaveCoin = async (coinId) => {
    // find the coin in `searchedCoins` state by the matching id
    let coinToSave = searchedCoins.find((coin) => coin.coinId === coinId);

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

  // if data isn't here yet, say so
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <div className="container mx-auto">
        <div className="py-10">
          <div className="container mx-auto text-center">
            <p className="text-3xl inline-block p-2 rounded-full text-sky-900 border-sky-900 border-2">
              Crypto Portal
            </p>
          </div>
          {!Auth.loggedIn() && (
            <p className="text-center text-xl">
              Login and save coins to your profile!
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {allCoins.map((coin) => (
            <div key={coin.coinId} className="flex justify-center">
              <div className="border-2 border-gray-600 rounded-lg p-4 flex flex-col justify-between">
                {coin.image && (
                  <img
                    src={coin.image}
                    alt={coin.title}
                    className="mb-4 border-2 border-gray-600"
                  />
                )}
                <h4>{coin.title}</h4>
                <p className="text-sm">Token: {coin.symbol}</p>
                <p>{coin.coinId}</p>
                <div className="flex items-center justify-between">
                  <p className="mb-0">
                    Current Price: {coin.current_price?.toFixed(5)}
                  </p>
                  {/* Save button */}
                  {Auth.loggedIn() &&
                    (savedCoinIds?.some(
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
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing
                <span className="font-medium">
                  {" "}
                  {searchedCoins.length ? 1 : 0}{" "}
                </span>
                to
                <span className="font-medium"> 10 </span>
                of
                <span className="font-medium">
                  {" "}
                  {searchedCoins.length || 0}{" "}
                </span>
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <a
                  href="top"
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                {/* <!-- Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" --> */}
                <a
                  href="top"
                  aria-current="page"
                  className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  1
                </a>
                <a
                  href="top"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  2
                </a>
                <a
                  href="top"
                  className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                >
                  3
                </a>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                  ...
                </span>
                <a
                  href="top"
                  className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex"
                >
                  8
                </a>
                <a
                  href="top"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  9
                </a>
                <a
                  href="top"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  10
                </a>
                <a
                  href="top"
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchCoins;
