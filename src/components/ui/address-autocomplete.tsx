"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AddressSuggestion } from "@/app/api/address-autocomplete/route";

type AddressAutocompleteProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  disabled?: boolean;
};

export function AddressAutocomplete({
  value,
  onValueChange,
  onSelect,
  placeholder = "Enter your street address",
  ariaLabel = "Service address",
  className,
  inputClassName,
  autoFocus,
  disabled,
}: AddressAutocompleteProps) {
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSelected, setHasSelected] = useState(false);

  useEffect(() => {
    if (hasSelected) return;
    const trimmed = value.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/address-autocomplete?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          setSuggestions([]);
          return;
        }
        const data = (await response.json()) as { suggestions: AddressSuggestion[] };
        setSuggestions(data.suggestions ?? []);
        setActiveIndex(-1);
        if ((data.suggestions ?? []).length > 0) setIsOpen(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [value, hasSelected]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(suggestion: AddressSuggestion) {
    setHasSelected(true);
    setIsOpen(false);
    setSuggestions([]);
    setActiveIndex(-1);
    onValueChange(suggestion.label);
    onSelect(suggestion);
    inputRef.current?.blur();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      if (event.key === "ArrowDown" && suggestions.length > 0) {
        setIsOpen(true);
        event.preventDefault();
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-label={ariaLabel}
          autoComplete="off"
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onValueChange(e.target.value);
            setHasSelected(false);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full h-12 pl-10 pr-10 rounded-lg border text-base font-medium",
            "bg-white text-gray-900 placeholder:text-gray-500",
            "border-gray-300 focus:outline-none focus:ring-2 focus:ring-fiber-blue focus:border-transparent",
            "shadow-sm transition-shadow",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            inputClassName
          )}
        />
        {isLoading && (
          <Loader2
            aria-hidden="true"
            className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-gray-500"
          />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 w-full max-h-72 overflow-auto rounded-lg border border-gray-200 bg-white shadow-xl"
        >
          {suggestions.map((suggestion, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={suggestion.id}
                role="option"
                aria-selected={isActive}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(suggestion);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 cursor-pointer text-sm border-b border-gray-100 last:border-b-0",
                  isActive ? "bg-fiber-blue/10" : "hover:bg-gray-50"
                )}
              >
                <MapPin
                  aria-hidden="true"
                  className="size-4 text-fiber-blue mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-900 leading-snug">{suggestion.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
