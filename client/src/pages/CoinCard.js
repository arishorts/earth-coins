import Auth from "../utils/auth";
import { NetworkStatus } from "@apollo/client";
import { CheckIcon, PlusIcon } from "@heroicons/react/20/solid";

const CoinCard = ({
  coin,
  networkStatus,
  loading,
  error,
  onSaveCoin,
  savedCoinIds,
  savingCoins,
}) => {
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  // if data isn't here yet, say so
  if (networkStatus === NetworkStatus.refetch) return "Refetching!";
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <li className="border-2 border-gray-600 col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200 h-full">
      <div className="flex-1 flex flex-col p-8">
        <div className="w-30 h-30 flex-shrink-0 mx-auto rounded-full overflow-hidden">
          <img className="h-full w-full object-cover" src={coin.image} alt="" />
        </div>
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
          onClick={() => {
            onSaveCoin(coin.coinId);
          }}
          disabled={savingCoins || savedCoinIds.includes(coin.coinId)}
          className={classNames(
            savedCoinIds.includes(coin.coinId)
              ? "opacity-50 cursor-not-allowed"
              : "save-new-coin",
            "relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-2 text-sm font-medium"
          )}
        >
          {Auth.loggedIn() && savedCoinIds.includes(coin.coinId) ? (
            <>
              <CheckIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
              <span className="ml-3">Saved</span>
            </>
          ) : (
            <>
              <PlusIcon className="w-5 h-5 text-white-400" aria-hidden="true" />
              <span className="ml-3">Save</span>
            </>
          )}
        </button>
      </div>
    </li>
  );
};

export default CoinCard;
