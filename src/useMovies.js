import { useState, useEffect } from "react";

const key = "f485dbee";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setError("");
          setIsLoading((loading) => !loading);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (data.Response === "False")
            throw new Error("Big Big racku, neam film");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
          console.error(err.message);
        } finally {
          setIsLoading((loading) => !loading);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
      } else fetchMovies();
      return () => controller.abort();
    },
    [query]
  );

  return { movies, isLoading, error };
}
