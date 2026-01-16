import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFavorites, removeFromFavorites } from "../helpers/favoriteHelpers";

const IMG_URL = "https://image.tmdb.org/t/p/w500";
const DEFAULT_IMG = "https://via.placeholder.com/500x750?text=No+Image";

const Favorites = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (currentUser) {
        const data = await getFavorites(currentUser.uid);
        setFavorites(data);
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [currentUser]);

  const handleRemove = async (movieId) => {
    if (!currentUser) return;

    await removeFromFavorites(currentUser.uid, movieId);
    setFavorites((prev) => prev.filter((fav) => fav.movieId !== movieId));
  };

  const getRatingColor = (vote) => {
    if (vote >= 7) return "bg-green-500";
    if (vote >= 5) return "bg-yellow-500";
    return "bg-pink-600";
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-lg text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
        ❤️ Favori Filmlerim
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-xl">
          <p className="text-lg text-gray-500 mb-6">
            Henüz favori film eklemediniz.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded bg-primary text-white font-bold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Filmleri Keşfet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {favorites.map((fav) => (
            <div
              key={fav.movieId}
              className="relative rounded-xl overflow-hidden bg-dark-700 group"
            >
              <img
                src={fav.poster_path ? IMG_URL + fav.poster_path : DEFAULT_IMG}
                alt={fav.title}
                onClick={() => navigate(`/movie/${fav.movieId}`)}
                className="w-full h-72 object-cover cursor-pointer"
              />
              <div className="p-4">
                <h3 className="text-sm font-medium truncate mb-2">
                  {fav.title}
                </h3>
                <div
                  className={`inline-block px-2 py-1 rounded text-xs font-bold ${getRatingColor(
                    fav.vote_average
                  )}`}
                >
                  {fav.vote_average?.toFixed(1)}
                </div>
              </div>
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer"
                onClick={() => handleRemove(fav.movieId)}
                title="Favorilerden Kaldır"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
