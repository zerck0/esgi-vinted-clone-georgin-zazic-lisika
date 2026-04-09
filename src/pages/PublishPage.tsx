import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { CATEGORIES, CONDITIONS } from "../types/article";
import type { Article, ArticleFormData } from "../types/article";

type PublishForm = {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  size: string;
  imageUrl: string;
};

const initialForm: PublishForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  condition: "",
  size: "",
  imageUrl: "",
};

function isValidImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validate(values: PublishForm): { [key: string]: string } {
  const errors: { [key: string]: string } = {};

  const title = values.title.trim();
  const description = values.description.trim();
  const size = values.size.trim();
  const imageUrl = values.imageUrl.trim();
  const priceNumber = Number(values.price);

  if (!title)
    errors.title = "Le titre est requis.";
  else if (title.length < 3 || title.length > 100)
    errors.title = "Le titre doit contenir entre 3 et 100 caractères.";
  if (!description)
    errors.description = "La description est requise.";
  else if (description.length < 10 || description.length > 1000)
    errors.description = "La description doit contenir entre 10 et 1000 caractères.";
  if (!values.price)
    errors.price = "Le prix est requis.";
  else if (Number.isNaN(priceNumber) || priceNumber <= 0)
    errors.price = "Le prix doit être supérieur à 0.";
  if (!values.category)
    errors.category = "La catégorie est requise.";
  if (!values.condition)
    errors.condition = "L'état est requis.";
  if (!size)
    errors.size = "La taille est requise.";

  if (!imageUrl)
    errors.imageUrl = "L'URL de l'image est requise.";
  else if (!isValidImageUrl(imageUrl))
    errors.imageUrl = "L'URL de l'image est invalide.";

  return errors;
}

export default function PublishPage() {
  const [form, setForm] = useState<PublishForm>(initialForm);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createArticleMutation = useMutation({
    mutationFn: (payload: ArticleFormData) =>
      api.post<Article>("/api/articles", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  function updateField(field: keyof PublishForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setApiError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0)
      return;

    const payload: ArticleFormData = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      condition: form.condition,
      size: form.size.trim(),
      imageUrl: form.imageUrl.trim(),
    };

    try {
      const created = await createArticleMutation.mutateAsync(payload);
      navigate(`/articles/${created.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Une erreur est survenue.";
      setApiError(message);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">
        Publier une annonce
      </h1>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4 rounded-lg border bg-white p-4"
      >
        <div className="space-y-1">
          <label htmlFor="title" className="text-sm font-medium">
            Titre
          </label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="price" className="text-sm font-medium">
            Prix
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) => updateField("price", event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="category" className="text-sm font-medium">
              Catégorie
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Sélectionner</option>
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="condition" className="text-sm font-medium">
              État
            </label>
            <select
              id="condition"
              value={form.condition}
              onChange={(event) => updateField("condition", event.target.value)}
              className="w-full rounded-md border px-3 py-2"
            >
              <option value="">Sélectionner</option>
              {CONDITIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.condition && (
              <p className="text-sm text-red-600">{errors.condition}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="size" className="text-sm font-medium">
            Taille
          </label>
          <input
            id="size"
            type="text"
            value={form.size}
            onChange={(event) => updateField("size", event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.size && <p className="text-sm text-red-600">{errors.size}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="imageUrl" className="text-sm font-medium">
            URL image
          </label>
          <input
            id="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-600">{errors.imageUrl}</p>
          )}
        </div>

        {apiError && (
          <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {apiError}
          </p>
        )}

        <button
          type="submit"
          disabled={createArticleMutation.isPending}
          className="rounded-md bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {createArticleMutation.isPending ? "Publication..." : "Publier"}
        </button>
      </form>
    </div>
  );
}