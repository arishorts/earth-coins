import React, { useState, useEffect } from "react";
import Auth from "../utils/auth";
import { saveCoinIds, getSavedCoinIds } from "../utils/localStorage";
import { useMutation, useQuery } from "@apollo/client";
import { SAVE_COIN } from "../utils/mutations";
import { QUERY_GETAPICOINS, QUERY_GETCOINLIST } from "../utils/queries";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CheckIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";

const SearchCoins = () => {
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(16);
  const [totalCoins, setTotalCoins] = useState(0);
  // const { loading, error, data, fetchMore } = useQuery(QUERY_GETAPICOINS, {
  //   variables: { offset, limit },
  //   // skip: !limit, // Skip initial query until limit is set
  // });
  const { loading, error, data, fetchMore } = useQuery(QUERY_GETCOINLIST, {
    variables: { first: 200 },
    fetchPolicy: "cache-and-network",
  });
  // const coinList = data?.getAPICoins || [];
  const coinList = data?.getCoinList?.edges || [];

  // create state for holding returned google api data
  const [searchedCoins, setSearchedCoins] = useState([]);
  const [visibleCoins, setVisibleCoins] = useState([]);

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
  }, [limit]);

  // set up useEffect hook to save `savedCoinIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveCoinIds(savedCoinIds);
  }, [savedCoinIds]);

  useEffect(() => {
    if (!loading && data?.getCoinList?.edges) {
      setSearchedCoins(coinList);
    }
  }, [loading, data]);

  // create function to handle saving a coin to our database
  const handleSaveCoin = async (coinId) => {
    // find the coin in `searchedCoins` state by the matching id
    let coinToSave = searchedCoins.find((coin) => coin.node.coinId === coinId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      await saveCoin({
        variables: {
          content: { ...coinToSave.node },
        },
      });

      // if coin successfully saves to user's account, save coin id to state
      setSavedCoinIds([coinToSave.node.coinId, ...savedCoinIds]);
    } catch (err) {
      console.error(err);
    }
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleLimitSelect = (limit) => {
    setLimit(limit);
    //NEED TO UNCOMMENT THIS OUT WHEN READY
    //refetch();
  };

  // const handlePageChange = (newOffset) => {
  //   fetchMore({
  //     variables: {
  //       offset: newOffset,
  //     },
  //   });
  //   //added above code starting at etchmore which causes the app to hit 429 limit rather quickly
  //   setOffset(newOffset);
  //   //NEED TO UNCOMMENT THIS OUT WHEN READY
  //   //refetch();
  // };

  const handlePageChange = (newOffset) => {
    console.log("newoffset is : ", newOffset);
    console.log("limit is : ", limit);
    console.log(newOffset * limit);
    console.log(coinList);
    console.log(coinList[limit - 1]?.cursor);

    const currentPage = Math.floor((newOffset * limit) / 200) + 1;

    if (currentPage % 200 === 0) {
      const nextPage = currentPage / 200 + 1;
      fetchMore({
        variables: {
          first: 200,
          after: coinList[coinList.length - 1].cursor,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;
          const newCoinList = [
            ...prevResult.getCoinList.edges,
            ...fetchMoreResult.getCoinList.edges,
          ];
          setSearchedCoins(newCoinList); // Update coinList state with new data
          return {
            getCoinList: {
              ...prevResult.getCoinList,
              edges: [
                ...prevResult.getCoinList.edges,
                ...fetchMoreResult.getCoinList.edges,
              ],
              pageInfo: fetchMoreResult.getCoinList.pageInfo,
            },
          };
        },
      });
    }
    setOffset(newOffset);
  };

  // Calculate the start and end indices based on the current page and selected option
  useEffect(() => {
    const startIndex = (offset - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const newVisibleCoins = coinList
      .map((coin) => coin.node)
      .slice(startIndex, endIndex);
    setVisibleCoins(newVisibleCoins);
  }, [coinList, limit, offset]);

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
                {limit}
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
                        onClick={() => handleLimitSelect(8)}
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
                        onClick={() => handleLimitSelect(16)}
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
                        onClick={() => handleLimitSelect(32)}
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
                          onClick={() => handleLimitSelect(50)}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {visibleCoins.map((coin) => (
            <li
              key={coin.coinId}
              className="border-2 border-gray-600 col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200"
            >
              <div className="flex-1 flex flex-col p-8">
                <img
                  className="w-30 h-30 flex-shrink-0 mx-auto bg-black rounded-full"
                  src={coin.image}
                  alt=""
                />
                <h3 className="mt-6 text-gray-900 font-medium">{coin.name}</h3>
                <dl className="mt-1 flex-grow flex flex-col justify-between">
                  <dt className="sr-only">Price</dt>
                  <dd className="text-gray-500">
                    <span className="px-2 py-1 text-green-800 font-medium bg-green-100 rounded-full">
                      {coin.current_price}
                    </span>
                  </dd>
                  <dt className="sr-only">Symbol</dt>
                  <dd className="mt-3">
                    <span className="px-2 py-1 text-green-800 font-medium bg-green-100 rounded-full">
                      {coin.symbol}
                    </span>
                  </dd>
                </dl>
              </div>
              <div className="flex justify-end mt-2 mb-3">
                {/* Save button */}
                <button
                  onClick={() => handleSaveCoin(coin.coinId)}
                  disabled={savedCoinIds.includes(coin.coinId)}
                  className={classNames(
                    savedCoinIds.includes(coin.coinId)
                      ? "opacity-50 cursor-not-allowed"
                      : "save-new-coin",
                    "relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-2 text-sm font-medium"
                  )}
                >
                  {Auth.loggedIn() && savedCoinIds.includes(coin.coinId) ? (
                    <>
                      <CheckIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-3">Saved</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon
                        className="w-5 h-5 text-white-400"
                        aria-hidden="true"
                      />
                      <span className="ml-3">Save</span>
                    </>
                  )}
                </button>
              </div>
            </li>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {searchedCoins.length
                    ? parseInt(limit) * (offset - 1) + 1
                    : 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {searchedCoins.length ? parseInt(limit) * offset : 1}
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
                  onClick={() => handlePageChange(offset - 1)}
                  disabled={offset === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="flex items-center mx-2">
                  Page <span className="mx-1 font-bold">{offset}</span> of{" "}
                  {Math.ceil(totalCoins / limit)}
                </div>
                <button
                  onClick={() => handlePageChange(offset + 1)}
                  disabled={offset === Math.ceil(totalCoins / limit)}
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
