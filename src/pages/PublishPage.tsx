import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import type { Article, ArticleFormData } from "../types/article";
import ArticleForm from "../components/ArticleForm";

export default function PublishPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createArticleMutation = useMutation({
    mutationFn: (payload: ArticleFormData) =>
      api.post<Article>("/api/articles", payload),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
      navigate(`/articles/${created.id}`);
    },
  });

  async function handleSubmit(data: ArticleFormData): Promise<Article> {
    return createArticleMutation.mutateAsync(data);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">Publier une annonce</h1>

      <ArticleForm
        onSubmit={handleSubmit}
        isSubmitting={createArticleMutation.isPending}
      />
    </div>
  );
}
