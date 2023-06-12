import Auth from "../utils/auth";
import { removeCoinId } from "../utils/localStorage";

import { useMutation, useQuery } from "@apollo/client";
import { REMOVE_COIN } from "../utils/mutations";
import { QUERY_ME } from "../utils/queries";

const SavedCoins = () => {
  // create state to hold saved coinId values
  const { loading, data: userData, refetch } = useQuery(QUERY_ME);

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
      refetch();
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
      <div className="py-10">
        <div className="container mx-auto text-center">
          <p className="text-3xl inline-block p-2 rounded-full text-sky-900 border-sky-900 border-2">
            {profile?.coinCount
              ? `Viewing ${profile.coinCount} saved ${
                  profile.coinCount === 1 ? "coin!" : "coins!"
                }`
              : "You have no saved coins!"}
          </p>
        </div>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {profile?.savedCoins &&
            profile.savedCoins.map((coin) => (
              <div key={coin.coinId} className="flex justify-center">
                <div className="border border-gray-300 rounded-lg p-4 flex flex-col justify-between">
                  {coin.image && (
                    <img src={coin.image} alt={coin.title} className="mb-4" />
                  )}
                  <h4>{coin.title}</h4>
                  <p className="text-sm">Token: {coin.symbol}</p>
                  <p>{coin.coinId}</p>
                  <p className="mb-0">
                    Current Price: {localStorage.getItem(`coinPrice-${coin.coinId}`)}
                  </p>
                  <button
                    className="bg-red-900 hover:bg-red-700 transition duration-400 text-white text-center py-2 px-4 rounded-full w-full mt-4"
                    onClick={() => handleDeleteCoin(coin.coinId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default SavedCoins;
