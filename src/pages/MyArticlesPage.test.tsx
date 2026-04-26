import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MyArticlesPage from "./MyArticlesPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { api } from "../services/api";

vi.mock("../services/api", () => ({
  api: {
    get: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

describe("MyArticlesPage", () => {
  it("affiche un message quand l'utilisateur n'a pas d'annonces", async () => {
    vi.mocked(api.get).mockResolvedValue([]);

    render(<MyArticlesPage />, { wrapper });

    const emptyMessage = await screen.findByText(
      /Vous n'avez pas encore d'annonces/i,
    );
    expect(emptyMessage).toBeInTheDocument();
  });

  it("affiche un lien vers la page de publication quand la liste est vide", async () => {
    vi.mocked(api.get).mockResolvedValue([]);

    render(<MyArticlesPage />, { wrapper });

    const link = await screen.findByRole("link", {
      name: /Créer une annonce/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/publish");
  });
});
