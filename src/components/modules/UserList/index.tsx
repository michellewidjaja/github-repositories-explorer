import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ReposList } from "./types";
import { Star } from "react-feather";

import type { GitHubSearchUsersResponse } from "./types"

interface UserListProps {
  resultList: GitHubSearchUsersResponse | null
}

function UserList({ resultList }: UserListProps) {
  const [reposList, setReposList] = useState<ReposList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userData = resultList && resultList?.items?.length > 0 ? resultList.items : null;

  const handleClickUser = async (url: string) => {
    setIsLoading(true);
    setReposList([]);
    const res = await fetch(url, {
      headers: {
        Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
      }
    });
  
    if (!res.ok) {
      throw new Error("Failed to fetch GitHub users");
    }
    const data = await res.json();
    setReposList(data);
    setIsLoading(false);
  }
  
  return (
    <div className="mt-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
      >
        {
          userData?.map((user, key) => (
            <AccordionItem value={`user-${key}`} key={`user-${key}`}>
              <AccordionTrigger className="rounded-none cursor-pointer items-center" onClick={() => handleClickUser(user.repos_url)}>
                <div className="flex flex-row gap-4 items-center">
                  <img src={user.avatar_url} width={50} height={50} alt={`img-${user.login}`} className="rounded" />
                  {user.login}
                </div>
              </AccordionTrigger> 
              <AccordionContent className="flex flex-col gap-2 bg-gray-50 p-4">
              {
                reposList.length > 0 ? 
                reposList.map((repo, key) => (
                  <Card key={`repos-${key}`} className="hover:bg-gray-50">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between gap-2">
                        <div className="flex gap-2 flex-col lg:!flex-row lg:items-center">
                          {repo.name}
                          <Badge className="rounded-xl text-[12px]">{repo.visibility}</Badge>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Star size={16}/>{repo.stargazers_count}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {repo.description || "No description"}
                    </CardContent>
                  </Card>
                ))
                : isLoading ? "Loading..." : "No repository"
              }
              </AccordionContent>
            </AccordionItem>
          ))
        }

    </Accordion>
    </div>
  )
}

export default UserList