import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../auth/firebase";
import { toast } from "react-toastify";

const Register = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: displayName,
      });

      toast.success("Kayıt başarılı! Hoş geldiniz!");
      navigate("/");
    } catch (err) {
      const errorMessages = {
        "auth/email-already-in-use": "Bu e-posta zaten kullanımda!",
        "auth/weak-password": "Şifre en az 6 karakter olmalı!",
        "auth/invalid-email": "Geçersiz e-posta adresi!",
      };
      toast.error(errorMessages[err.code] || "Kayıt başarısız!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-70px)] p-4">
      <div className="bg-black/75 p-8 md:p-12 rounded-lg w-full max-w-md">
        <h2 className="text-center text-2xl md:text-3xl font-bold mb-8">
          Kayıt Ol
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block mb-2 text-gray-400">Ad Soyad</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Adınız Soyadınız"
              required
              className="w-full px-4 py-3 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

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
              placeholder="En az 6 karakter"
              required
              className="w-full px-4 py-3 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Kayıt Oluşturuluyor..." : "Kayıt Ol"}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500">
          Zaten hesabın var mı?{" "}
          <Link to="/login" className="text-white hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
