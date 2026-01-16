import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MovieDetail from "../pages/MovieDetail";
import Favorites from "../pages/Favorites";
import PrivateRouter from "./PrivateRouter";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/movie/:id"
          element={
            <PrivateRouter>
              <MovieDetail />
            </PrivateRouter>
          }
        />
        <Route
          path="/favorites"
          element={
            <PrivateRouter>
              <Favorites />
            </PrivateRouter>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
