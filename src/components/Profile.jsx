import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { token } = useAuth("state");

    useEffect(() => {
        fetch(
            `${import.meta.env.VITE_API_BASE_URL}users/profiles/profile_data/`,
            {
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                return response.json();
            })
            .then((data) => {
                setUserData(data);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando perfil...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="card">
            {userData ? (
                <>
                    <div className="card-content">
                        <div className="media">
                            <div className="media-left">
                                <figure className="image is-48x48">
                                    <img
                                        src={
                                            userData.image ||
                                            "https://bulma.io/assets/images/placeholders/96x96.png"
                                        }
                                        alt="Profile image"
                                        style={{ borderRadius: "50%" }}
                                    />
                                </figure>
                            </div>
                            <div className="media-content">
                                <p className="title is-4 pb-2">
                                    {userData.first_name} {userData.last_name}
                                </p>
                                <div
                                    className="subtitle is-6"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <img
                                        src={`${
                                            import.meta.env.VITE_API_BASE_URL
                                        }${userData.state.icon}`}
                                        alt="State icon"
                                        style={{
                                            height: "20px",
                                            marginRight: "5px",
                                            borderRadius: "50%",
                                        }}
                                    />
                                    {userData.state.name}
                                </div>
                            </div>
                        </div>

                        <div className="content">
                            Email: {userData.email}
                            <br />
                            Fecha de Nacimiento: {userData.dob}
                            <br />
                            Biografía: {userData.bio || "No disponible"}
                        </div>
                    </div>
                </>
            ) : (
                <p className="subtitle">No se encontraron datos del usuario.</p>
            )}
        </div>
    );
}

export default Profile;
