import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { Link } from "react-router-dom";
import { CONDITIONS, CATEGORIES } from "../types/article";
import { useState } from "react";

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [sort, setSort] = useState("date_desc");
  const { data } = useQuery({
    queryKey: ["articles", search, category, condition, sort],
    queryFn: () => {
      const params = new URLSearchParams();

      if (search.trim() )
        params.set("search", search.trim());
      if (category)
        params.set("category", category);
      if (condition)
        params.set("condition", condition);
      if (sort)
        params.set("sort", sort);
      const queryString = params.toString();
      const path = queryString ? `api/articles?${queryString}` : "/api/articles";

      return api.get<Article[]>(path)
    }
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
    <div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher..."
          className="w-full border rounded-md px-3 py-2"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">Toutes les catégories</option>
          {CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>

        <select
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">Tous les états</option>
          {CONDITIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="w-full border rounded-md px-3 py-2"
>
          <option value="date_desc">Plus récent</option>
          <option value="date_asc">Plus ancien</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>

      {(!data || data.length === 0) && <p>Aucun article trouvé.</p>}
      {data?.map((article) => (
        <Link
          key={article.id}
          to={`/articles/${article.id}`}
        >
          <img
            src={article.imageUrl}
            alt={article.title}
          />

          <div className="p-3">
            <h2>{article.title}</h2>
            <p>
              {article.price.toLocaleString("fr-FR", { style: "currency", currency: "EUR"})}
            </p>
            <p>
              {getConditionLabel(article.condition)} - {getCategoryLabel(article.category)}
            </p>

            <p>
              Vendeur : {article.userName}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
