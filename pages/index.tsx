/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ReactNode } from "react";
import { getSearchLayout } from "../components/layouts/SearchLayout";

const Home = () => {
 

  return (
    <div className="flex flex-col space-y-4">
    </div>
  );
};

Home.getLayout = (page: ReactNode) => getSearchLayout(page, "Home");

export default Home;
