import React, { useEffect, useState, useRef } from "react";
import SongCard from "./SongCard";

function SongList() {
    const [page, setPage] = useState(1);
    const [songs, setSongs] = useState([]);
    const [nextUrl, setNextUrl] = useState(null);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const observerRef = useRef();
    const lastSongElementRef = useRef();

    const doFetch = async () => {
        setIsLoading(true);
        fetch(
            `${
                import.meta.env.VITE_API_BASE_URL
            }harmonyhub/songs/?page=${page}&page_size=5`,
            {}
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.results) {
                    setSongs((prevSongs) => [...prevSongs, ...data.results]);
                    setNextUrl(data.next);
                }
            })
            .catch(() => {
                setIsError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        doFetch();
    }, [page]);

    useEffect(() => {
        // Si la petición esta en proceso no creamos observador
        if (isLoading) return;

        // Si hay otro observador definido lo desuscribimos
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        // Creamos y referenciamos el observador de tarjetas actual
        observerRef.current = new IntersectionObserver((cards) => {
            // Observamos todas las tarjetas de la nueva página cargada
            if (cards[0].isIntersecting && nextUrl) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        // Actualizamos la referencia al última tarjeta
        if (lastSongElementRef.current) {
            observerRef.current.observe(lastSongElementRef.current);
        }
    }, [isLoading, nextUrl]);

    if (isError) return <p>Error al cargar las canciones.</p>;
    if (!songs.length && !isLoading) return <p>No hay canciones disponibles</p>;

    return (
        <div>
            <div className="my-5">
                <h2 className="title">Lista de Canciones</h2>
                <ul>
                    {songs.map((song, index) => {
                        if (songs.length === index + 1) {
                            return (
                                <div
                                    key={song.id}
                                    ref={lastSongElementRef}
                                    className="column is-two-thirds"
                                >
                                    <SongCard song={song} />
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    key={song.id}
                                    className="column is-two-thirds"
                                >
                                    <SongCard song={song} />
                                </div>
                            );
                        }
                    })}
                </ul>
                {isLoading && <p>Cargando más canciones...</p>}
            </div>
        </div>
    );
}

export default SongList;
