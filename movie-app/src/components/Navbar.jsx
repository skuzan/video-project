import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Çıkış Yapıldı");
      navigate("/login");
    } catch (error) {
      toast.error("Çıkış Yapılamadı!!!");
    }
    setMenuOpen(false)
  };

  return (
    <nav className="flex flex-wrap justify-between items-center px-4 md:px-8 py-4 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="text-xl font-bold">
        <Link
          to="/"
          className="text-primary hover:text-primary-hover transition-colors"
        >
          🎬 Movie App
        </Link>
      </div>

      {/* Hamburger Menü */}
      <button
        className="md:hidden text-white text-2xl p-2"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row w-full md:w-auto items-center gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-700`}
      >
        {currentUser ? (
          <>
            <Link
              to="/favorites"
              className="w-full md:w-auto text-center px-4 py-2 rounded bg-primary/20 border border-primary text-white hover:bg-primary/40 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              ❤️ Favorilerim
            </Link>
            <span className="text-gray-400 text-sm">
              👤 {currentUser.displayName || currentUser.email?.split("@")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="w-full md:w-auto px-4 py-2 border border-gray-600 rounded text-white hover:bg-primary hover:border-primary transition-colors cursor-pointer"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="w-full md:w-auto text-center px-4 py-2 rounded hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Giriş Yap
            </Link>
            <Link
              to="/register"
              className="w-full md:w-auto text-center px-4 py-2 rounded bg-primary hover:bg-primary-hover transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
