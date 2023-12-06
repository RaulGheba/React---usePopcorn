import { useState, useEffect } from "react";

const KEY = "55358428";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      callback?.();
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true); //indicates to the UI that loading is happening
          setError(""); // the error was never reset, so before we fetch, we make it empty here.
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
          );
          if (!res.ok) {
            throw new Error("Something went wrong with fetching movies");
          } // if nothing goes wrong, we just move on. no need for 'else' here

          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("Movie not found");
          } // if nothing goes wrong, we just move on. no need for 'else' here

          setMovies(data.Search); //the movies array is set to every movie found by the user search/query
        } catch (err) {
          setError(err.message);
        } finally {
          // because code after errors is no longer evaluated, we put a finally block here.
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query, callback]
  );

  return { movies, isLoading, error };
}
