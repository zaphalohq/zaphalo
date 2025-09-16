import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "@src/components/UI/select";
import { Input } from "@src/components/UI/input";


export default function SelectField({ query, queryValueName, dispalyName, selectedVal="", placeholder, onSelect, disabled=false }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");

  if (selectedVal !== selected){
    setSelected(selectedVal);
  }

  // Apollo query
  const { data, loading } = useQuery(query, {
    variables: { search, limit: 10 },
    fetchPolicy: "cache-and-network",
  });

  const options = data ? data[queryValueName] : [];

  return (
    <Select
      value={selected}
      onValueChange={(val) => {
        setSelected(val);
        onSelect(val);
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="w-[var(--radix-select-trigger-width)] min-w-[var(--radix-select-trigger-width)]">
        {/* Search input inside dropdown */}
        <div className="p-2 sticky top-0 bg-white z-10">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm"
          />
        </div>

        <SelectScrollUpButton>▲</SelectScrollUpButton>

        {loading ? (
          <SelectItem disabled>
            Loading...
          </SelectItem>
        ) : options.length > 0 ? (
          options.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>
              {opt[dispalyName]}
            </SelectItem>
          ))
        ) : (
          <SelectItem disabled>
            No results found
          </SelectItem>
        )}

        <SelectScrollDownButton>▼</SelectScrollDownButton>
      </SelectContent>
    </Select>
  );
}