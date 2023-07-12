import React, { useState, useEffect } from "react";
import Auth from "../utils/auth";
import { saveCoinIds, getSavedCoinIds } from "../utils/localStorage";
import { useMutation, useQuery, NetworkStatus } from "@apollo/client";
import { SAVE_COIN } from "../utils/mutations";
import { QUERY_GETCOINLIST, QUERY_GETTOTALCOINS } from "../utils/queries";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/20/solid";
import CoinCard from "./CoinCard";

const SearchCoins = () => {
  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(16);
  const [totalCoins, setTotalCoins] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [savingCoins, setSavingCoins] = useState(false);

  // create state for holding returned google api data
  const [searchedCoins, setSearchedCoins] = useState([]);
  const [visibleCoins, setVisibleCoins] = useState([]);

  // create state to hold saved coinId values
  const [savedCoinIds, setSavedCoinIds] = useState(getSavedCoinIds());
  const [saveCoin] = useMutation(SAVE_COIN);

  const { loading, error, data, fetchMore, networkStatus } = useQuery(
    QUERY_GETCOINLIST,
    {
      variables: { page: 1 },
      fetchPolicy: "cache-first", //this is the default and didn't need to be set mmanually
      pollInterval: 5 * 60 * 1000, // Poll every 5 minutes (in milliseconds)
      notifyOnNetworkStatusChange: true,
      errorPolicy: "all",
    }
  );

  const { loading: totalloading, data: totaldata } =
    useQuery(QUERY_GETTOTALCOINS);

  useEffect(() => {
    if (!totalloading && totaldata?.getTotalCoins) {
      setTotalCoins(totaldata.getTotalCoins.length);
    }
  }, [totalloading, totaldata]);

  //this useEffect might go crazy when i start to add fetchmore-ing into the equation
  useEffect(() => {
    if (!loading && data?.getCoinList?.edges) {
      // const coinList = data?.getAPICoins || [];
      const newSearchedCoins = data?.getCoinList?.edges || [];
      setSearchedCoins(newSearchedCoins);
    }
  }, [loading, data]);

  // set up useEffect hook to save `savedCoinIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveCoinIds(savedCoinIds);
  }, [savedCoinIds]);

  // Calculate the start and end indices based on the current page and selected option
  useEffect(() => {
    if (!loading && !totalloading) {
      const startIndex = (offset - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const newVisibleCoins = searchedCoins
        .map((coin) => coin.node)
        .slice(startIndex, endIndex);
      setVisibleCoins(newVisibleCoins);
      const newtotalpages = searchedCoins.length / limit;
      setTotalPages(newtotalpages);
    }
  }, [searchedCoins, limit, offset, loading, totalloading]);

  // create function to handle saving a coin to our database
  const handleSaveCoin = async (coinId) => {
    setSavingCoins(true);
    // find the coin in `searchedCoins` state by the matching id
    let coinToSave = searchedCoins.find((coin) => coin.node.coinId === coinId);
    let newCoinToSave = {
      coinId: coinToSave.node.coinId,
      ath: coinToSave.node.ath,
      image: coinToSave.node.image,
      current_price: coinToSave.node.current_price,
      symbol: coinToSave.node.symbol,
      market_cap: coinToSave.node.market_cap,
    };

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }
    try {
      await saveCoin({
        variables: {
          content: { ...newCoinToSave },
        },
      });

      // if coin successfully saves to user's account, save coin id to state
      setSavedCoinIds([coinToSave.node.coinId, ...savedCoinIds]);
    } catch (err) {
      console.error(err);
    }
    setSavingCoins(false);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleLimitSelect = (limit) => {
    setOffset(1);
    setLimit(limit);
  };

  const handlePageChange = (newOffset) => {
    if (newOffset > Math.floor(totalPages)) {
      fetchMore({
        variables: {
          after: searchedCoins[searchedCoins.length - 1].cursor,
          total: totalCoins,
          page: searchedCoins.length / 200 + 1,
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

  // if data isn't here yet, say so
  if (networkStatus === NetworkStatus.refetch) return "Refetching!";
  if (loading && totalloading) return "Loading...";
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
            <div>
              <CoinCard
                coin={coin}
                onSaveCoin={handleSaveCoin}
                loading={loading}
                error={error}
                networkStatus={networkStatus}
                savedCoinIds={savedCoinIds}
                savingCoins={savingCoins}
              />
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
