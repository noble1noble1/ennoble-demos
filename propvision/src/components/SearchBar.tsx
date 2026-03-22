"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (address: string) => void;
  isSearching: boolean;
}

export function SearchBar({ onSearch, isSearching, autoFocus }: SearchBarProps & { autoFocus?: boolean }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

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
      <div className={`search-bar ${isFocused ? "search-bar-focused" : ""}`}>
        <div className="search-icon">
          {isSearching ? (
            <Loader2 size={20} className="animate-spin text-accent" />
          ) : (
            <Search size={20} className="text-zinc-500" />
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter any US property address..."
          className="search-input"
          aria-label="Property address search"
        />
        <button
          type="submit"
          disabled={!value.trim() || isSearching}
          className="search-button"
          aria-label="Analyze property"
        >
          ANALYZE
        </button>
      </div>
      <button
        type="button"
        onClick={handleDemo}
        className="demo-button"
        aria-label="Try demo with 350 Fifth Avenue address"
      >
        Try demo: 350 Fifth Avenue, New York, NY
      </button>
    </form>
  );
}
