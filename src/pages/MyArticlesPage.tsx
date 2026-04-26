import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentUserId } from "../hooks/useCurrentUserId";
import { api } from "../services/api";
import { Link } from "react-router-dom";
import type { Article } from "../types/article";

export default function MyArticlesPage() {
  const userId = useCurrentUserId();
  const queryClient = useQueryClient();

  const {
    data: articles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-articles", userId],
    queryFn: () => api.get<Article[]>(`/api/users/${userId}/articles`),
  });

  if (isLoading) {
    return <p>Chargement...</p>;
  }
  if (isError) {
    return <p>Erreur</p>;
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">Vous n'avez pas encore d'annonces.</p>
        <Link to="/publish" className="text-teal-600 hover:underline">
          Créer une annonce
        </Link>
      </div>
    );
  }

  const handleDelete = async (articleId: string) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette annonce ?",
    );
    if (confirmDelete) {
      try {
        await api.delete(`/api/articles/${articleId}`);
        await queryClient.invalidateQueries({
          queryKey: ["my-articles", userId],
        });
      } catch {
        alert("Erreur lors de la suppression");
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes annonces</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col p-1"
          >
            <Link
              to={`/articles/${article.id}`}
              className="flex flex-col h-full"
            >
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="p-3 flex flex-col gap-1">
                <h2 className="font-semibold text-sm truncate">
                  {article.title}
                </h2>
                <p className="text-teal-600 font-bold text-sm">
                  {article.price.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
            </Link>

            <div className="p-3 pt-0 mt-auto flex gap-3 border-t border-gray-50 pt-2">
              <Link
                to={`/articles/${article.id}/edit`}
                className="text-teal-600 text-sm font-medium hover:underline"
              >
                Modifier
              </Link>
              <button
                onClick={() => handleDelete(article.id)}
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
