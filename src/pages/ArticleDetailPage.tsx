import { useParams } from "react-router-dom";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { useQuery } from "@tanstack/react-query";
import { CATEGORIES, CONDITIONS } from "../types/article";

export default function ArticleDetailPage() {
    const { id } = useParams<{id: string}>();

    const { data: article, isLoading, isError } = useQuery<Article>({
        queryKey: ["article", id],
        queryFn: () => api.get<Article>(`/api/articles/${id}`)
    });

    function getCategoryLabel(id: string) {
      return CATEGORIES.find((c) => c.id === id)?.label ?? id;
    }

    function getConditionLabel(value: string) {
      return CONDITIONS.find((c) => c.value === value)?.label ?? value;
    }

    if (isLoading) {
      return <p>Chargement...</p>;
    }

    if (isError || !article) {
      return <p>Article introuvable ou une erreur est survenue.</p>;
    }
    return (
  <div className="max-w-2xl mx-auto px-4 py-8">
    <img
      src={article.imageUrl}
      alt={article.title}
      className="w-full h-80 object-cover rounded-xl mb-6"
    />

    <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
    <p className="text-gray-600 mb-6">{article.description}</p>

    <ul className="flex flex-col gap-2 text-sm text-gray-700">
      <li><span className="font-medium">Catégorie :</span> {getCategoryLabel(article.category)}</li>
      <li><span className="font-medium">État :</span> {getConditionLabel(article.condition)}</li>
      <li><span className="font-medium">Taille :</span> {article.size}</li>
      <li><span className="font-medium">Vendeur :</span> {article.userName}</li>
    </ul>
  </div>
);
}
