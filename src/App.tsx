import { useState } from 'react';
import './App.css';
import SearchUser from './components/modules/SearchUser';
import UserList from './components/modules/UserList';
import { toast } from "sonner"
import type { GitHubSearchUsersResponse } from './components/modules/UserList/types';
import { GitHub } from 'react-feather';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<GitHubSearchUsersResponse | null>(null);

  const handleSearchUsers = async (query: string) => {
    setSearchResult(null);
    if (query.length < 3) {
      toast("Please input words more than 3")
      return false;
    }
    setIsLoading(true);
    const res = await fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch GitHub users");
    }
  
    const data = await res.json();
    setIsLoading(false);
    setSearchResult(data)
    return data.items;
  };
  
  return (
    <div className="w-full h-full">
      <header className="font-bold mb-12 flex flex-col items-center gap-1">
        <GitHub size={32} /> 
        <h2 className="text-3xl">GitHub</h2>
      </header>
      <main>
        <Card>
          <CardHeader>
            <CardTitle>Search GitHub Username</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchUser isLoading={isLoading} onClickSearch={handleSearchUsers} />
          </CardContent>
        </Card>
        <UserList resultList={searchResult} />
      </main>
    </div>
  )
}

export default App
