import Auth from "../utils/auth";
import { removeCoinId } from "../utils/localStorage";

import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_COIN } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

const SavedCoins = () => {
  // create state to hold saved coinId values
  const { loading, error, data: userData, refetch } = useQuery(QUERY_ME);

  // Check if data is returning from the `QUERY_ME` query
  const profile = userData?.me || {};
  const [removeCoin] = useMutation(REMOVE_COIN, {
    update(cache, { data: { removeCoin } }) {
      try {
        const { me } = cache.readQuery({ query: QUERY_ME }) || {};
        if (me) {
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
        }
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
      //refetch was a quick fix to remove bug where the user adds a coin and it doesnt populate in me if the user goes straight from Home page to their profile
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  refetch();
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      <div className="py-10">
        <div className="container mx-auto text-center">
          <p className="text-3xl inline-block p-2 text-sky-900">
            {profile?.coinCount
              ? `Viewing ${profile.coinCount} saved ${
                  profile.coinCount === 1 ? "coin!" : "coins!"
                }`
              : "You have no saved coins!"}
          </p>
        </div>
      </div>
      <div className="container mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {profile?.savedCoins &&
            profile.savedCoins.map((coin) => (
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
                  <h3 className="mt-6 text-gray-900 font-medium">
                    {coin.name}
                  </h3>
                  <dl className="mt-1 flex-grow flex flex-col justify-between">
                    <dt className="sr-only">Price</dt>
                    <dd className="text-gray-500">{coin.current_price}</dd>
                    <dt className="sr-only">Symbol</dt>
                    <dd className="mt-3">
                      <span className="px-2 py-1 text-green-800 font-medium bg-green-100 rounded-full">
                        {coin.symbol}
                      </span>
                    </dd>
                  </dl>
                </div>
                <div className="flex justify-end mt-2 mb-3">
                  {/* Delete button */}
                  <button
                    className="bg-red-900 hover:bg-red-700 transition duration-400 text-white text-center py-2 px-4 w-full"
                    onClick={() => handleDeleteCoin(coin.coinId)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </div>
      </div>
    </>
  );
};

export default SavedCoins;
