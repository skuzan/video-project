import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import { toast } from "react-toastify";
import { getGenres, searchMovies, discoverMovies } from "../services/api";

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Debounce: searchTerm değiştiğinde 500ms bekle
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Genre listesini çek
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getGenres();
        setGenres(data);
      } catch (error) {
        toast.error("Kategoriler yüklenemedi!");
      }
    };
    fetchGenres();
  }, []);

  // Filmleri çek (debounced search ile)
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let data;
        if (debouncedSearch) {
          data = await searchMovies(debouncedSearch, page);
        } else {
          data = await discoverMovies(page, selectedGenre || null);
        }
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 700));
      } catch (error) {
        toast.error("Filmler yüklenemedi!");
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [debouncedSearch, selectedGenre, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSelectedGenre("");
  };

  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId);
    setSearchTerm("");
    setDebouncedSearch("");
    setPage(1);
  };

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      {/* Arama Formu */}
      <form onSubmit={handleSearch} className="flex justify-center gap-2 mb-8">
        <input
          type="text"
          placeholder="Film ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-6 py-3 rounded-full bg-white/10 text-white placeholder-gray-500 outline-none focus:bg-white/15 transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-full bg-primary text-white hover:scale-105 transition-transform cursor-pointer"
        >
          🔍
        </button>
      </form>

      {/* Genre Filtreleme */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          className={`px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer ${
            !selectedGenre
              ? "bg-primary border-primary text-white"
              : "border-gray-600 text-gray-400 hover:border-primary hover:text-white"
          }`}
          onClick={() => handleGenreChange("")}
        >
          Tümü
        </button>
        {genres.slice(0, 8).map((genre) => (
          <button
            key={genre.id}
            className={`px-4 py-2 rounded-full border text-sm transition-colors cursor-pointer ${
              selectedGenre === String(genre.id)
                ? "bg-primary border-primary text-white"
                : "border-gray-600 text-gray-400 hover:border-primary hover:text-white"
            }`}
            onClick={() => handleGenreChange(String(genre.id))}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Film Listesi */}
      {loading ? (
        <div className="text-center py-16 text-lg text-gray-500">
          Yükleniyor...
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-16 text-lg text-gray-500">
          Film bulunamadı.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Sayfalama */}
          <div className="flex justify-center items-center gap-6 mt-8 py-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-3 rounded-lg border border-gray-600 text-white hover:bg-primary hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              ← Önceki
            </button>
            <span className="text-gray-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-3 rounded-lg border border-gray-600 text-white hover:bg-primary hover:border-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Sonraki →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
