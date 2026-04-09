import { useState } from "react";
import { api } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  articleId: string;
  isFavorited: boolean;
};

export function FavoriteButton({ articleId, isFavorited }: Props) {
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsPending(true);
    try {
      if (isFavorited) {
        await api.delete(`/api/favorites/${articleId}`);
      } else {
        await api.post(`/api/favorites/${articleId}`, {});
      }
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
    >
      {isFavorited ? "💚" : "🤍"}
    </button>
  );
}
