import { useContext } from "react";
import { PortfolioDataContext } from "./portfolioDataStore";

export function usePortfolioData() {
  return useContext(PortfolioDataContext);
}