// components/SearchBar.js
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import stocksData from '../data/stocks.json';

export default function SearchBar() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (event, value) => {
    if (value) {
      router.push(`/stocks/${value.symbol}`);
    }
  };

  return (
    <Autocomplete
      options={stocksData}
      getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
      style={{ width: 300 }}
      onChange={handleSearch}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} label="Search Stocks" variant="outlined" />}
    />
  );
}
