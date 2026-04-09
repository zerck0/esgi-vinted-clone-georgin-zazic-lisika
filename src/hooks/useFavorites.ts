import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import type { Article } from "../types/article";

export function useFavorites() {
  const { data = [] } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => api.get<Article[]>("/api/favorites"),
  });

  return data.map((article) => article.id);
}
