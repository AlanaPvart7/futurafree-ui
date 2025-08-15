    import { useNavigate } from "react-router-dom";
    import { useAuth } from "../context/AuthContext";
    import { useEffect } from "react";

    const Layout = ({ children }) => {
    const navigate = useNavigate();
    const { user, logout, validateToken } = useAuth();

    useEffect(() => {
        const interval = setInterval(() => {
        if (!validateToken()) {
            clearInterval(interval);
        }
        }, 60000);
        validateToken();
        return () => clearInterval(interval);
    }, [validateToken]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-green-50">
        {/* Navbar */}
        <nav className="relative overflow-hidden rounded-xl border border-blue-500/20 shadow-lg">
            {/* Fondo animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 backdrop-blur-md"></div>

            {/* Burbujas flotantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute h-4 w-4 rounded-full bg-blue-400/10 animate-float top-4 left-[10%]"></div>
            <div className="absolute h-3 w-3 rounded-full bg-blue-400/10 animate-float top-8 left-[20%] [animation-delay:0.5s]"></div>
            <div className="absolute h-5 w-5 rounded-full bg-blue-400/10 animate-float top-6 left-[80%] [animation-delay:1s]"></div>
            <div className="absolute h-6 w-6 rounded-full bg-blue-400/10 animate-float top-2 left-[60%] [animation-delay:1.5s]"></div>
            </div>

            {/* Contenido navbar */}
            <div className="relative px-4 sm:px-8 py-4">
            <div className="flex items-center justify-between">
                {/* Logo + Nombre */}
                <div className="flex items-center space-x-3 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg blur group-hover:blur-md transition-all duration-300"></div>
                    <img
                    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmNvZ2did3gyZDM4cXIxZzdndmJvYWJhMmh3Y3ozYmxpYjV1eTc3eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hA5daWGWG1G6c/giphy.gif"
                    alt="Logo"
                    className="relative w-10 h-10 rounded-lg transform group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white">
                    ¡Bienvenido a FuturaFree! 🎧
                </span>
                </div>

                {/* Saludo + Logout */}
                <div className="flex items-center space-x-4">
                <p className="text-gray-200 hidden sm:block">
                    Hola {`${user.firstname} ${user.lastname}`}
                </p>
                <button
                    className="relative group"
                    onClick={handleLogout}
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                    <div className="relative px-4 py-2 bg-red-600 rounded-lg text-white font-medium">
                    Cerrar Sesión
                    </div>
                </button>
                </div>
            </div>

            {/* Menú */}
            <div className="hidden md:flex items-center space-x-10 mt-4">
                <button
                onClick={() => navigate("/dashboard")}
                className="relative group"
                >
                <span className="text-blue-100 group-hover:text-white transition-colors duration-300 flex items-center">
                    🏠 Inicio
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                onClick={() => navigate("/catalog-types")}
                className="relative group"
                >
                <span className="text-blue-100 group-hover:text-white transition-colors duration-300 flex items-center">
                    🏷️ Tipos
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>

                <button
                onClick={() => navigate("/catalogs")}
                className="relative group"
                >
                <span className="text-blue-100 group-hover:text-white transition-colors duration-300 flex items-center">
                    📋 Catálogos
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>
            </div>
            </div>
        </nav>

        {/* Contenido principal */}
        <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
        </div>
    );
    };

    export default Layout;
