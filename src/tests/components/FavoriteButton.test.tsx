import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { FavoriteButton } from "../../components/article/FavoriteButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("../../services/api", () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("FavoriteButton", () => {
  it("affiche un cœur vert quand l'article est en favori", () => {
    render(<FavoriteButton articleId="1" isFavorited={true} />, { wrapper });

    expect(screen.getByRole("button")).toHaveTextContent("💚");
  });

  it("affiche un cœur blanc quand l'article n'est pas en favori", () => {
    render(<FavoriteButton articleId="1" isFavorited={false} />, { wrapper });

    expect(screen.getByRole("button")).toHaveTextContent("🤍");
  });
});
