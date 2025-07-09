import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchUser from ".";
import { vi } from "vitest";

describe("SearchUser", () => {
  it("renders input and search button", () => {
    render(<SearchUser isLoading={false} onClickSearch={() => {}} />)
    expect(screen.getByPlaceholderText(/github username/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("calls onClickSearch when button is clicked", () => {
    const mockSearch = vi.fn();
    render(<SearchUser isLoading={false} onClickSearch={mockSearch} />);
    const input = screen.getByPlaceholderText(/github username/i);
    fireEvent.change(input, {
      target: { value: "michelle" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(mockSearch).toHaveBeenCalledWith("michelle");
  });

  it("aria invalid input if words less than 3", () => {
    const mockSearch = vi.fn();
    render(<SearchUser isLoading={false} onClickSearch={mockSearch} />);
    const input = screen.getByPlaceholderText(/github username/i);
    fireEvent.change(input, {
      target: { value: "mi" },
    });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));
    expect(input).toHaveAttribute("aria-invalid", 'true');
    expect(mockSearch).toHaveBeenCalled();
  });
})