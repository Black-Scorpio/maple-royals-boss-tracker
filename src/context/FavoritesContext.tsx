import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (monsterId: string) => void;
  isFavorite: (monsterId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Load favorites from localStorage on initial render
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem("favorites");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Toggle a favorite and persist the change
  const toggleFavorite = (monsterId: string) => {
    let updatedFavorites;
    if (favorites.includes(monsterId)) {
      updatedFavorites = favorites.filter((id) => id !== monsterId); // Remove if already favorited
    } else {
      updatedFavorites = [...favorites, monsterId]; // Add if not favorited
    }
    setFavorites(updatedFavorites); // Update state
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Persist to localStorage
  };

  // Check if a monster is favorited
  const isFavorite = (monsterId: string) => favorites.includes(monsterId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
