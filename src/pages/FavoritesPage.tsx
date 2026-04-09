import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { FavoriteButton } from "../components/FavoriteButton";

export default function FavoritesPage() {
  const favoriteIds = useFavorites();
  const { data: articles = [] } = useQuery({
    queryKey: ["articles-full"],
    queryFn: () => api.get<Article[]>("/api/articles"),
  });

  const favoriteArticles = articles.filter((a) => favoriteIds.includes(a.id));

  if (favoriteArticles.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">Aucun favoris.</p>
        <Link to="/" className="text-teal-600 hover:underline">Retour</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes favoris</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteArticles.map((article) => (
          <div key={article.id} className="bg-white rounded-xl shadow overflow-hidden relative">
            <Link to={`/articles/${article.id}`} className="flex flex-col h-full">
              <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-3 flex flex-col gap-1">
                <h2 className="font-semibold text-sm truncate">{article.title}</h2>
                <p className="text-teal-600 font-bold text-sm">
                  {article.price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                </p>
              </div>
            </Link>
            <FavoriteButton articleId={article.id} isFavorited={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
