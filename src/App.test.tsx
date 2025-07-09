import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { vi } from "vitest";

const mockUsers = {
  total_count: 1,
  incomplete_results: false,
  items: [
    {
      login: "mic",
      id: 1,
      avatar_url: "https://example.com/avatar.png",
      repos_url: "https://api.github.com/users/mic/repos",
      type: "User",
    },
  ],
};

const mockRepos = [
  {
    name: "mic-repo",
    visibility: "public",
    description: "Test repo",
    stargazers_count: 123,
  },
];

// Mock global fetch
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn((url: string) => {
    if (url.includes("/search/users")) {
      return Promise.resolve(new Response(JSON.stringify(mockUsers), { status: 200 }));
    }
    if (url.includes("/users/mic/repos")) {
      return Promise.resolve(new Response(JSON.stringify(mockRepos), { status: 200 }));
    }
    return Promise.reject(new Error("Unexpected fetch"));
  }) as typeof fetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App", () => {
  it("renders App successfully", async () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/github username/i);
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "mic" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("mic")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("mic"));

    await waitFor(() => {
      expect(screen.getByText("mic-repo")).toBeInTheDocument();
      expect(screen.getByText("Test repo")).toBeInTheDocument();
    });
  });
})