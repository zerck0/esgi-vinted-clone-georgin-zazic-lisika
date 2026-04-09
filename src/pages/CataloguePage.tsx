import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { Link } from "react-router-dom";
import { CONDITIONS, CATEGORIES } from "../types/article";
import { useState } from "react";
import { FavoriteButton } from "../components/FavoriteButton";
import { useFavorites } from "../hooks/useFavorites";

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("date_desc");

  const favoriteIds = useFavorites();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["articles", search, category, condition, sort, priceMin, priceMax],
    queryFn: () => {
      const params = new URLSearchParams();

      if (search.trim())
        params.set("search", search.trim());
      if (category)
        params.set("category", category);
      if (condition)
        params.set("condition", condition);
      if (sort)
        params.set("sort", sort);
      if (priceMin)
        params.set("priceMin", priceMin);
      if (priceMax)
        params.set("priceMax", priceMax);

      const queryString = params.toString();
      const path = queryString ? `/api/articles?${queryString}` : "/api/articles";

      return api.get<Article[]>(path);
    },
  });

  function getConditionLabel(conditionValue: string) {
    return (
      CONDITIONS.find((condition) => condition.value === conditionValue)?.label ?? conditionValue
    );
  }

  function getCategoryLabel(categoryId: string) {
    return (
      CATEGORIES.find((category) => category.id === categoryId)?.label ?? categoryId
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      <aside className="w-56 shrink-0 flex flex-col gap-6">
        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">
            Catégories
          </h3>
          <ul className="flex flex-col gap-1">
            <li>
              <button
                onClick={() => setCategory("")}
                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition ${
                  category === "" ? "bg-teal-100 text-teal-700 font-semibold" : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                Toutes
              </button>
            </li>
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => setCategory(cat.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition ${
                    category === cat.id ? "bg-teal-100 text-teal-700 font-semibold" : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">
            État
          </h3>
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value="">Tous</option>
            {CONDITIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wide">
            Prix
          </h3>
          <div className="flex gap-2">
            <input
              type="number"
              value={priceMin}
              onChange={(event) => setPriceMin(event.target.value)}
              placeholder="Min"
              className="w-full border rounded-md px-2 py-1.5 text-sm"
            />
            <input
              type="number"
              value={priceMax}
              onChange={(event) => setPriceMax(event.target.value)}
              placeholder="Max"
              className="w-full border rounded-md px-2 py-1.5 text-sm"
            />
          </div>
        </div>
      </aside>

      <div className="flex-1">
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher..."
            className="flex-1 border rounded-md px-3 py-2 text-sm"
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          >
            <option value="date_desc">Plus récent</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>

        {isLoading && <p className="text-center mt-10 text-gray-500">Chargement...</p>}
        {isError && <p className="text-center mt-10 text-red-500">Une erreur est survenue.</p>}
        {!isLoading && data?.length === 0 && (
          <p className="text-center mt-10 text-gray-500">Aucun article trouvé.</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden flex flex-col relative"
            >
              <Link
                to={`/articles/${article.id}`}
                className="flex flex-col h-full"
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 flex flex-col gap-1">
                  <h2 className="font-semibold text-sm truncate">{article.title}</h2>
                  <p className="text-teal-600 font-bold text-sm">
                    {article.price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getConditionLabel(article.condition)} · {getCategoryLabel(article.category)}
                  </p>
                  <p className="text-xs text-gray-400">{article.userName}</p>
                </div>
              </Link>

              <FavoriteButton
                articleId={article.id}
                isFavorited={favoriteIds.includes(article.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
