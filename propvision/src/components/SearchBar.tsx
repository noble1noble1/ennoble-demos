"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Search, Loader2, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: (address: string) => void;
  isSearching: boolean;
}

const DEMO_ADDRESSES = [
  "350 Fifth Avenue, New York, NY 10118",
  "123 Main St, Boston, MA 02101",
  "456 Oak Drive, Austin, TX 73301",
  "789 Market Street, San Francisco, CA 94103",
  "1600 Pennsylvania Ave, Washington, DC 20500",
  "233 S Wacker Dr, Chicago, IL 60606",
  "100 Biscayne Blvd, Miami, FL 33132",
  "1000 Vin Scully Ave, Los Angeles, CA 90012",
];

export function SearchBar({ onSearch, isSearching, autoFocus }: SearchBarProps & { autoFocus?: boolean }) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (!value.trim()) return DEMO_ADDRESSES.slice(0, 5);
    const q = value.toLowerCase();
    return DEMO_ADDRESSES.filter((a) => a.toLowerCase().includes(q)).slice(0, 5);
  }, [value]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim()) {
        setShowSuggestions(false);
        onSearch(value.trim());
      }
    },
    [value, onSearch]
  );

  const handleSelectSuggestion = useCallback(
    (address: string) => {
      setValue(address);
      setShowSuggestions(false);
      onSearch(address);
    },
    [onSearch]
  );

  const handleDemo = useCallback(() => {
    const demoAddress = "350 Fifth Avenue, New York, NY 10118";
    setValue(demoAddress);
    onSearch(demoAddress);
  }, [onSearch]);

  return (
    <form ref={wrapperRef} onSubmit={handleSubmit} className="search-bar-wrapper">
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
          onChange={(e) => {
            setValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter any US property address..."
          className="search-input"
          aria-label="Property address search"
          autoComplete="off"
          role="combobox"
          aria-expanded={showSuggestions && filteredSuggestions.length > 0}
          aria-autocomplete="list"
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
      {/* Autocomplete suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && !isSearching && (
        <div className="search-suggestions" role="listbox">
          {filteredSuggestions.map((address) => (
            <button
              key={address}
              type="button"
              className="search-suggestion-item"
              role="option"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectSuggestion(address);
              }}
            >
              <MapPin size={12} className="text-zinc-600 flex-shrink-0" />
              <span>{address}</span>
            </button>
          ))}
        </div>
      )}
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
