import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import {
  ChangeEvent,
  FC,
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SerumMarketInfo, useSerumMarkets } from "../../hooks/useSerumMarkets";
import { serumMarketFilter } from "../../utils/filters";
import { prettifyPubkey } from "../../utils/pubkey";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { HeaderLayout } from "./HeaderLayout";
import { PublicKey } from "@solana/web3.js";
import { AccountTypes } from "../../utils/typeChecks";


type SearchLayoutProps = {
  title?: string;
  children: ReactNode;
};

const defaultMarkets: SerumMarketInfo[] = [
  {
    address: new PublicKey("8BnEgHoWFysVcuFFX7QztDmzuH8r5ZFvyP3sYwn1XTh6"), baseSymbol: "SOL", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("BbJgE7HZMaDp5NTYvRh5jZSkQPVDTU8ubPFtpogUkEj4"), baseSymbol: "ETH", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("8PhnCfgqpgFM7ZJvttGdBVMXHuU4Q23ACxCvWkbs1M71"), baseSymbol: "BONK", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("H87FfmHABiZLRGrDsXRZtqq25YpARzaokCzL1vMYGiep"), baseSymbol: "JTO", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("FbwncFP5bZjdx8J6yfDDTrCmmMkwieuape1enCvwLG33"), baseSymbol: "JUP", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("3NnxQvDcZXputNMxaxsGvqiKpqgPfSYXpNigZNFcknmD"), baseSymbol: "MNGO", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("4E17F3BxtNVqzVsirxguuqkpYLtFgCR6NfTpccPh82WE"), baseSymbol: "PYTH", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("JAmhJbmBzLp2aTp9mNJodPsTcpCJsmq5jpr6CuCbWHvR"), baseSymbol: "JitoSOL", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("9Lyhks5bQQxb9EyyX55NtgKQzpM4WK7JCmeaWuQ5MoXD"), baseSymbol: "mSOL", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("8rUvvjhtyjiJYTVhNn8usWDAQn1RHwt2adChzk7ANeT4"), baseSymbol: "SOLAPE", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("74fKpZ1NFfusLacyVzQdMXXawe9Dr1Kz8Yw1cw12QQ3y"), baseSymbol: "MOUTAI", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  {
    address: new PublicKey("DZjbn4XC8qoHKikZqzmhemykVzmossoayV9ffbsUqxVj"), baseSymbol: "RAY", quoteSymbol: "USDC",
    type: AccountTypes.SerumMarketInfo
  },
  // Add more default markets as needed
];

export const SearchLayout: FC<SearchLayoutProps> = ({
  title,
  children,
}: SearchLayoutProps) => {
  const router = useRouter();
  const { serumMarkets } = useSerumMarkets();

  const [selected, setSelected] = useState<SerumMarketInfo | undefined>(
    serumMarkets && serumMarkets[0]
  );
  const [marketQuery, setMarketQuery] = useState("");

  const [filteredMarkets, setFilteredMarkets] = useState(
    serumMarkets ? serumMarkets : defaultMarkets
  );

  const queryChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setMarketQuery(e.target.value);
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(queryChangeHandler, 500),
    []
  );

  const handleSelect = (value: SerumMarketInfo | undefined) => {
    if (value) {
      setSelected(value);
      router.push({
        pathname: `/market/${value.address.toString()}`,
        query: router.query,
      });
    }
  };

  useEffect(() => {
    if (serumMarkets) {
      if (marketQuery !== "") {
        const q = new RegExp(marketQuery, "i");
        setFilteredMarkets(
          serumMarkets.filter((row) => serumMarketFilter(q, row)).slice(0, 5)
        );
      } else setFilteredMarkets(serumMarkets.slice(0, 5));
    } else setFilteredMarkets(defaultMarkets);
  }, [marketQuery, serumMarkets]);

  return (
    <HeaderLayout title={title}>
      <div>
        <div className="text-center mb-4">
          <h1 className="mt-10 text-2xl font-bold">Access market data and tooling</h1>
          <p className="text-lg">Paste a market address to proceed.</p>
        </div>
        <Combobox value={selected} onChange={(value) => handleSelect(value)}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-md bg-slate-800 text-left border border-slate-700 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0">
              <Combobox.Button as="div">
                <Combobox.Input
                  placeholder="Search markets"
                  className="w-full border-none py-3 pl-3 pr-10 text-sm leading-5 text-slate-200 bg-slate-800 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 placeholder:text-slate-400"
                  onChange={debouncedChangeHandler}
                />
              </Combobox.Button>
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-cyan-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setMarketQuery("")}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-800 shadow-2xl border border-slate-700 py-1 text-base shadow-lgsm:text-sm">
                {filteredMarkets.length === 0 && marketQuery !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredMarkets.map((market) => (
                    <Combobox.Option
                      key={market.address.toString()}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 px-4 flex items-center justify-between ${
                          active
                            ? "serum-gradient text-slate-800 font-medium"
                            : "text-slate-400"
                        }`
                      }
                      value={market}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`block truncate text-sm`}>
                          {prettifyPubkey(market.address)}
                        </span>
                      </div>
                      {market.baseSymbol && market.quoteSymbol ? (
                        <div>
                          <p>
                            {market.baseSymbol}/{market.quoteSymbol}
                          </p>
                        </div>
                      ) : null}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
      {children}
    </HeaderLayout>
  );
};

export const getSearchLayout = (page: React.ReactNode, title?: string) => (
  <SearchLayout title={title}>{page}</SearchLayout>
);
