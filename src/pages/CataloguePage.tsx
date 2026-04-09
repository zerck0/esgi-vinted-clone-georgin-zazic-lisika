import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";
import { Link } from "react-router-dom";

export default function CataloguePage() {
  const { data } = useQuery({
    queryKey: ["articles"],
    queryFn: () => api.get<Article[]>("api/articles")
  });

  if (!data || data.length === 0) {
    return <p>
      Aucun article trouvé.
    </p>;
  }

  return (
    <div>
      {data.map((article) => (
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
          </div>
        </Link>
      ))}
    </div>
  );
}
