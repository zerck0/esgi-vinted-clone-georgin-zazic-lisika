import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ArticleForm from "../../components/article/ArticleForm";

describe("ArticleForm", () => {
  it("affiche des messages d'erreur quand on soumet un formulaire vide", () => {
    const mockOnSubmit = vi.fn();

    render(<ArticleForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", {
      name: /enregistrer l'annonce/i,
    });
    fireEvent.click(submitButton);

    expect(screen.getByText("Le titre est requis.")).toBeInTheDocument();
    expect(screen.getByText("La description est requise.")).toBeInTheDocument();
    expect(screen.getByText("Le prix est requis.")).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("appelle onSubmit quand les données sont valides", async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue({ id: "1" });

    render(<ArticleForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText(/titre/i), {
      target: { value: "Mon beau pull de Lebron" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Bien soigné !" },
    });
    fireEvent.change(screen.getByLabelText(/prix/i), {
      target: { value: "20" },
    });
    fireEvent.change(screen.getByLabelText(/taille/i), {
      target: { value: "XL" },
    });
    fireEvent.change(screen.getByLabelText(/url image/i), {
      target: { value: "https://nba.com" },
    });

    fireEvent.change(screen.getByLabelText(/catégorie/i), {
      target: { value: "tops" },
    });
    fireEvent.change(screen.getByLabelText(/état/i), {
      target: { value: "bon_etat" },
    });

    const submitButton = screen.getByRole("button", {
      name: /enregistrer l'annonce/i,
    });
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
