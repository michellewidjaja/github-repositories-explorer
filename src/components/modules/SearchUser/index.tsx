import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchUserProps {
  isLoading: boolean;
  onClickSearch: (query: string) => void;
}

function SearchUser({ isLoading, onClickSearch }: SearchUserProps) {
  const [searchInput, setSearchInput] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(e.target.value);
    setHasError(value.length < 3);
  }

  const handleSearchKeyDown =  (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleClick();
    }
  }

  const handleClick = () => {
    onClickSearch(searchInput);
  }

  return (
    <>
      <Input type="text" placeholder="Please enter GitHub username..." aria-invalid={hasError} value={searchInput} onChange={handleSearchInput} onKeyDown={handleSearchKeyDown} />
      <Button className="w-full mt-4" onClick={handleClick} disabled={isLoading}>{isLoading ? "Searching..." : <div className="flex items-center gap-2">Search <Search /></div>}</Button>
    </>
  )
}

export default SearchUser;