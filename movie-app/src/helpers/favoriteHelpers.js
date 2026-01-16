import {
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../auth/firebase";

// Favorilere film ekle
export const addToFavorites = async (userId, movie) => {
  try {
    const favoriteRef = doc(db, "users", userId, "favorites", String(movie.id));
    await setDoc(favoriteRef, {
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      addedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("Favorilere eklenemedi:", error);
    return false;
  }
};

// Favorilerden film kaldır
export const removeFromFavorites = async (userId, movieId) => {
  try {
    const favoriteRef = doc(db, "users", userId, "favorites", String(movieId));
    await deleteDoc(favoriteRef);
    return true;
  } catch (error) {
    console.error("Favorilerden kaldırılamadı:", error);
    return false;
  }
};

// Film favori mi kontrol et
export const isFavorite = async (userId, movieId) => {
  try {
    const favoriteRef = doc(db, "users", userId, "favorites", String(movieId));
    const docSnap = await getDoc(favoriteRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Favori kontrolü başarısız:", error);
    return false;
  }
};

// Kullanıcının tüm favorilerini getir
export const getFavorites = async (userId) => {
  try {
    const favoritesRef = collection(db, "users", userId, "favorites");
    const snapshot = await getDocs(favoritesRef);
    const favorites = [];
    snapshot.forEach((doc) => {
      favorites.push({ id: doc.id, ...doc.data() });
    });
    return favorites;
  } catch (error) {
    console.error("Favoriler getirilemedi:", error);
    return [];
  }
};
