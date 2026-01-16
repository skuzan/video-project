import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// API fonksiyonları
export const getGenres = async () => {
  const { data } = await api.get("/genre/movie/list", {
    params: { language: "tr-TR" },
  });
  return data.genres || [];
};

export const searchMovies = async (query, page = 1) => {
  const { data } = await api.get("/search/movie", {
    params: { query, page },
  });
  return data;
};

export const discoverMovies = async (page = 1, genreId = null) => {
  const params = { page };
  if (genreId) params.with_genres = genreId;
  
  const { data } = await api.get("/discover/movie", { params });
  return data;
};

export const getMovieDetail = async (movieId) => {
  const { data } = await api.get(`/movie/${movieId}`, {
    params: { language: "tr-TR" },
  });
  return data;
};

export const getMovieVideos = async (movieId) => {
  const { data } = await api.get(`/movie/${movieId}/videos`);
  return data.results || [];
};

export default api;
