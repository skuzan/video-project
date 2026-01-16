import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addToFavorites, removeFromFavorites, isFavorite } from "../helpers/favoriteHelpers";
import { toast } from "react-toastify";
import { getMovieDetail, getMovieVideos } from "../services/api";

const IMG_URL = "https://image.tmdb.org/t/p/w1280";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Film detayını çek
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const [movieData, videos] = await Promise.all([
          getMovieDetail(id),
          getMovieVideos(id),
        ]);

        if (movieData.success === false) {
          toast.error("Film bulunamadı!");
          return;
        }

        setMovie(movieData);
        const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube");
        if (trailer) setVideoKey(trailer.key);
      } catch (error) {
        toast.error("Film yüklenemedi!");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  // Favori durumunu kontrol et
  useEffect(() => {
    const checkFavorite = async () => {
      if (currentUser && id) {
        const result = await isFavorite(currentUser.uid, id);
        setIsFav(result);
      }
    };
    checkFavorite();
  }, [currentUser, id]);

  // Favori toggle işlemi
  const handleFavoriteToggle = async () => {
    if (!currentUser || !movie) return;

    setFavLoading(true);
    try {
      if (isFav) {
        await removeFromFavorites(currentUser.uid, movie.id);
        setIsFav(false);
        toast.info("Favorilerden kaldırıldı");
      } else {
        await addToFavorites(currentUser.uid, movie);
        setIsFav(true);
        toast.success("Favorilere eklendi!");
      }
    } catch (error) {
      toast.error("İşlem başarısız!");
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 text-lg text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-16 text-lg text-gray-500">
        Film bulunamadı!
      </div>
    );
  }

  return (
    <div
      className="min-h-[calc(100vh-70px)] bg-cover bg-center p-4 md:p-8"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.9)), url(${IMG_URL}${movie.backdrop_path})`,
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="px-6 py-3 rounded bg-white/10 text-white hover:bg-white/20 transition-colors mb-8 cursor-pointer"
      >
        ← Geri
      </button>

      <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto items-center md:items-start text-center md:text-left">
        <img
          src={
            movie.poster_path
              ? IMG_URL + movie.poster_path
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.title}
          className="w-48 md:w-72 rounded-xl shadow-2xl"
        />

        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-500 italic mb-6">{movie.tagline}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6 text-lg">
            <span>⭐ {movie.vote_average?.toFixed(1)}</span>
            <span>📅 {movie.release_date?.slice(0, 4)}</span>
            <span>⏱️ {movie.runtime} dk</span>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
            {movie.genres?.map((g) => (
              <span
                key={g.id}
                className="px-4 py-2 bg-white/10 rounded-full text-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-white transition-all mb-6 cursor-pointer ${
              isFav
                ? "bg-primary"
                : "bg-transparent hover:bg-primary/20"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {favLoading
              ? "..."
              : isFav
              ? "❤️ Favorilerden Çıkar"
              : "🤍 Favorilere Ekle"}
          </button>

          <h3 className="text-primary font-semibold mb-3">Özet</h3>
          <p className="text-gray-400 leading-relaxed mb-8">
            {movie.overview || "Açıklama bulunamadı."}
          </p>

          {videoKey && (
            <div>
              <h3 className="text-primary font-semibold mb-4">Fragman</h3>
              <iframe
                src={`https://www.youtube.com/embed/${videoKey}`}
                title="Trailer"
                allowFullScreen
                className="w-full max-w-2xl h-48 md:h-80 rounded-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
