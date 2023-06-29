import React, { useState, useEffect } from "react";
import Auth from "../utils/auth";
import { saveCoinIds, getSavedCoinIds } from "../utils/localStorage";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_COIN } from "../utils/mutations";
import { QUERY_GETAPICOINS } from "../utils/queries";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";

const SearchCoins = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOption, setSelectedOption] = useState("8");
  const [totalCoins, setTotalCoins] = useState(0);
  const {
    loading,
    error,
    data: coinData,
    refetch, // Refetch function from useQuery
  } = useQuery(QUERY_GETAPICOINS, {
    variables: { page: currentPage },
    skip: !selectedOption, // Skip initial query until selectedOption is set
  });
  const allCoins = coinData?.getAPICoins || [];

  // create state for holding returned google api data
  const [searchedCoins, setSearchedCoins] = useState([]);

  // create state to hold saved coinId values
  const [savedCoinIds, setSavedCoinIds] = useState(getSavedCoinIds());
  const [saveCoin] = useMutation(SAVE_COIN);

  useEffect(() => {
    const fetchTotalCoins = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/list"
        );
        const coins = await response.json();
        setTotalCoins(coins.length);
      } catch (error) {
        console.error("Error occurred while fetching total coins:", error);
      }
    };

    fetchTotalCoins();
  }, []);

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

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    //NEED TO UNCOMMENT THIS OUT WHEN READY
    //refetch();
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
    //NEED TO UNCOMMENT THIS OUT WHEN READY
    //refetch();
  };

  // Calculate the start and end indices based on the current page and selected option
  const startIndex = (currentPage - 1) * parseInt(selectedOption);
  const endIndex = startIndex + parseInt(selectedOption);
  const visibleCoins = searchedCoins.slice(startIndex, endIndex);

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

        <div className="pb-3 text-right">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {selectedOption}
                <ChevronDownIcon
                  className="-mr-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <li
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                        onClick={() => handleOptionSelect("8")}
                      >
                        8
                      </li>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <li
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                        onClick={() => handleOptionSelect("16")}
                      >
                        16
                      </li>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <li
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                        onClick={() => handleOptionSelect("32")}
                      >
                        32
                      </li>
                    )}
                  </Menu.Item>
                  <form method="POST" action="#">
                    <Menu.Item>
                      {({ active }) => (
                        <li
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                          onClick={() => handleOptionSelect("50")}
                        >
                          50
                        </li>
                      )}
                    </Menu.Item>
                  </form>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
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
                Showing{" "}
                <span className="font-medium">
                  {searchedCoins.length
                    ? parseInt(selectedOption) * (currentPage - 1) + 1
                    : 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {searchedCoins.length
                    ? parseInt(selectedOption) * currentPage
                    : 1}
                </span>{" "}
                of <span className="font-medium">{totalCoins || 0} </span>{" "}
                results
              </p>
            </div>

            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex items-center mx-2">
                  Page <span className="mx-1 font-bold">{currentPage}</span> of
                  10
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === 10}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchCoins;
