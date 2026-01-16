import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../auth/firebase";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Giriş başarılı!");
      navigate("/");
    } catch (err) {
      const errorMessages = {
        "auth/user-not-found": "Kullanıcı bulunamadı!",
        "auth/wrong-password": "Şifre hatalı!",
        "auth/invalid-credential": "E-posta veya şifre hatalı!",
        "auth/too-many-requests": "Çok fazla deneme! Lütfen bekleyin.",
      };
      toast.error(errorMessages[err.code] || "Giriş başarısız!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Google ile giriş başarılı!");
      navigate("/");
    } catch (err) {
      toast.error("Google ile giriş başarısız!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-70px)] p-4">
      <div className="bg-black/75 p-8 md:p-12 rounded-lg w-full max-w-md">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-8">
          Giriş Yap
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-gray-400">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@email.com"
              required
              className="w-full px-4 py-3 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-gray-400">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-600"></div>
          <span className="px-4 text-gray-500">veya</span>
          <div className="flex-1 h-px bg-gray-600"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-4 border border-gray-600 rounded text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Google ile Giriş
        </button>

        <p className="text-center mt-8 text-gray-500">
          Hesabın yok mu?{" "}
          <Link to="/register" className="text-white hover:underline">
            Kayıt Ol
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
