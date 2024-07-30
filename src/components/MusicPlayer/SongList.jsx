import { useState, useEffect } from "react";
import SongCard from "./SongCard";

export default function SongList() {
    const [page, setPage] = useState(1);
    const [nextURL, setNextURL] = useState(null);
    const [songs, setSongs] = useState([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const doFetch = async () => {
        setIsLoading(true);
        fetch(
            `${
                import.meta.env.VITE_API_BASE_URL
            }harmonyhub/songs/?page=${page}&page_size=5`
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("No se puedieron cargar las canciones");
                }
                return response.json();
            })
            .then((data) => {
                if (data.results) {
                    setSongs((prevSongs) => [...prevSongs, ...data.results]);
                    setNextURL(data.next);
                }
            })
            .catch(() => {
                setIsError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    function handleLoadMore() {
        if (nextURL) {
            setPage((currentPage) => currentPage + 1);
        }
    }

    useEffect(() => {
        doFetch();
    }, [page]);

    return (
        <div>
            <div className="my-5">
                <h2 className="title">Lista de Canciones</h2>
                <ul>
                    {songs.map((song) => (
                        <div key={song.id} className="column is-two-thirds">
                            <SongCard song={song} />
                        </div>
                    ))}
                </ul>
                {isLoading && <p>Cargando más canciones...</p>}
                {nextURL && !isLoading && (
                    <button
                        className="button is-primary"
                        onClick={handleLoadMore}
                    >
                        Cargar más
                    </button>
                )}
            </div>
        </div>
    );
}
