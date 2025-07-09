import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserList from ".";
import { vi } from "vitest";

const mockResult = {
  "total_count": 355075,
  "incomplete_results": false,
  "items": [
    {
      "login": "mic",
      "id": 10423,
      "node_id": "MDQ6VXNlcjEwNDIz",
      "avatar_url": "https://avatars.githubusercontent.com/u/10423?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/mic",
      "html_url": "https://github.com/mic",
      "followers_url": "https://api.github.com/users/mic/followers",
      "following_url": "https://api.github.com/users/mic/following{/other_user}",
      "gists_url": "https://api.github.com/users/mic/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/mic/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/mic/subscriptions",
      "organizations_url": "https://api.github.com/users/mic/orgs",
      "repos_url": "https://api.github.com/users/mic/repos",
      "events_url": "https://api.github.com/users/mic/events{/privacy}",
      "received_events_url": "https://api.github.com/users/mic/received_events",
      "type": "User",
      "user_view_type": "public",
      "site_admin": false,
      "score": 1
    }
  ]
}

const mockRepos = [
  {
    name: "mic-repo",
    visibility: "public",
    description: "Test repo",
    stargazers_count: 123,
  },
];

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockRepos),
  })
) as unknown as typeof fetch;

describe("UserList", () => {
  it("renders user list", () => {
    render(<UserList resultList={mockResult} />)
    expect(screen.getByText(/mic/i)).toBeInTheDocument();
  });

  it("calls fetchRepos or renders repos when accordion is clicked", async () => {
    render(<UserList resultList={mockResult} />);
    expect(screen.getByText("mic")).toBeInTheDocument();

    fireEvent.click(screen.getByText(/mic/i));
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("mic-repo")).toBeInTheDocument();
      expect(screen.getByText("Test repo")).toBeInTheDocument();
    });
  });
})