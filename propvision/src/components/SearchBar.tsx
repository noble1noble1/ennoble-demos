"use client";

import { useState, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (address: string) => void;
  isSearching: boolean;
}

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim()) {
        onSearch(value.trim());
      }
    },
    [value, onSearch]
  );

  const handleDemo = useCallback(() => {
    const demoAddress = "350 Fifth Avenue, New York, NY 10118";
    setValue(demoAddress);
    onSearch(demoAddress);
  }, [onSearch]);

  return (
    <form onSubmit={handleSubmit} className="search-bar-wrapper">
      <div className="search-bar">
        <div className="search-icon">
          {isSearching ? (
            <Loader2 size={20} className="animate-spin text-accent" />
          ) : (
            <Search size={20} className="text-zinc-500" />
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter any US property address..."
          className="search-input"
        />
        <button
          type="submit"
          disabled={!value.trim() || isSearching}
          className="search-button"
        >
          ANALYZE
        </button>
      </div>
      <button
        type="button"
        onClick={handleDemo}
        className="demo-button"
      >
        Try demo: 350 Fifth Avenue, New York, NY
      </button>
    </form>
  );
}
