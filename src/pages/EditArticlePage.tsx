import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import type { Article, ArticleFormData } from "../types/article";
import { api } from "../services/api";
import { useCurrentUserId } from "../hooks/useCurrentUserId";
import ArticleForm from "../components/ArticleForm";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const currentUserId = useCurrentUserId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: article, isLoading, isError } = useQuery<Article>({
    queryKey: ["article-edit", id],
    queryFn: () => api.get<Article>(`/api/articles/${id}`),
  });

  const updateArticleMutation = useMutation({
    mutationFn: (payload: ArticleFormData) =>
      api.put<Article>(`/api/articles/${id}`, payload),
    onSuccess: async (updated) => {
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
      await queryClient.invalidateQueries({ queryKey: ["article", id] });
      await queryClient.invalidateQueries({ queryKey: ["my-articles"] });
      navigate(`/articles/${updated.id}`);
    },
  });

  async function handleSubmit(data: ArticleFormData): Promise<Article> {
    return updateArticleMutation.mutateAsync(data);
  }

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (isError || !article) {
    return <p>Erreur lors du chargement de l'annonce.</p>;
  }

  if (article.userId !== currentUserId) {
    return <p>Vous n'avez pas la permission de modifier cette annonce.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold">
        Modifier l'annonce : {article.title}
      </h1>

      <ArticleForm
        initialData={article}
        onSubmit={handleSubmit}
        isSubmitting={updateArticleMutation.isPending}
      />
    </div>
  );
}
