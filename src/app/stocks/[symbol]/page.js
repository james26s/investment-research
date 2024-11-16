"use client";

import { useParams } from "next/navigation";
import Typography from "@mui/material/Typography";
import data from "../../data/stocks.json";

export default function StockPage() {
  const { symbol } = useParams();

  // Find the stock data based on the symbol from the JSON file
  const stock = data.find((item) => item.symbol === symbol);

  if (!stock) {
    return (
      <div>
        <Typography variant="h4" color="error">
          Stock not found
        </Typography>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {stock.name} ({stock.symbol})
      </Typography>
      <Typography variant="h6" gutterBottom>
        Price: ${stock.price} ({stock.change} / {stock.percentChange}%)
      </Typography>
      <Typography variant="body1">{stock.description}</Typography>
      <Typography variant="body1" gutterBottom>
        Revenue: {stock.financials.revenue}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Net Income: {stock.financials.netIncome}
      </Typography>
      <Typography variant="body1" gutterBottom>
        EPS: {stock.financials.eps}
      </Typography>
      <Typography variant="body1" gutterBottom>
        P/E Ratio: {stock.financials.peRatio}
      </Typography>
    </div>
  );
}
