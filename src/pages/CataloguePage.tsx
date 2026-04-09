import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { Link } from "react-router-dom";
import { CONDITIONS, CATEGORIES } from "../types/article";
import { useState } from "react";

export default function CataloguePage() {
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["articles", search],
    queryFn: () => {
      const params = new URLSearchParams();

      if (search.trim() ) {
        params.set("search", search.trim());
      }

      const queryString = params.toString();
      const path = queryString ? `api/articles?${queryString}` : "api/articles";

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
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher par titre ou description..."
      />
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
