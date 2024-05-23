/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ReactNode } from "react";
import { getSearchLayout } from "../components/layouts/SearchLayout";

const Home = () => {
  return (
    <div className="flex flex-col">
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Don&apos;t have a market address?</h1>
        <p className="text-lg">
          Visit <a href="https://solscan.io" className="text-blue-500 underline">solscan.io</a> to find token markets.
        </p>
      </div>
      <div className="w-full max-w-md">
        {/* Your search layout component goes here */}
      </div>
    </div>
  );
};

Home.getLayout = (page: ReactNode) => getSearchLayout(page, "Home");

export default Home;
