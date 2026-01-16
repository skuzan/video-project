import { useNavigate } from "react-router-dom";

const IMG_URL = "https://image.tmdb.org/t/p/w500";
const DEFAULT_IMG = "https://via.placeholder.com/500x750?text=No+Image";

const MovieCard = ({ movie }) => {

  const navigate= useNavigate()

  const getRatingColor = (vote) => {
    if( vote >=7) return "bg-green-500"
    if( vote >=5) return "bg-yellow-500"
    return "bg-pink-500"

  }


  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer bg-dark-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <img
        src={movie.poster_path ? IMG_URL + movie.poster_path : DEFAULT_IMG}
        alt={movie.title}
        className="w-full h-72 object-cover"
      />
      <div className="p-4">
        <h3 className="text-sm font-medium truncate mb-2">{movie.title}</h3>
        <div
          className={`inline-block px-2 py-1 rounded text-xs font-bold ${getRatingColor(
            movie.vote_average
          )}`}
        >
          {movie.vote_average.toFixed(1)}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
