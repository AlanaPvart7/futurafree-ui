    import { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { useAuth } from "../context/AuthContext";

    const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (isSubmitting) return;
        setError("");
        setIsSubmitting(true);

        if (!email.trim()) return setErrorAndStop("El email es requerido");
        if (!email.includes("@") || !email.includes("."))
        return setErrorAndStop("Por favor ingresa un email válido");
        if (!password.trim())
        return setErrorAndStop("La contraseña es requerida");

        try {
        const result = await login(email, password);
        if (result) {
            navigate("/dashboard", { replace: true });
        }
        } catch (error) {
        setError(error.message || "Error al iniciar sesión. Intenta nuevamente.");
        } finally {
        setIsSubmitting(false);
        }
    };

    const setErrorAndStop = (msg) => {
        setError(msg);
        setIsSubmitting(false);
    };

    return (
        <div
        className="bg-cover bg-center min-h-screen flex justify-center items-center"
        style={{
            backgroundImage:
            "url('https://i.imgur.com/1W0MMBa.jpeg')",
        }}
        >
        <div className="flex flex-col items-center space-y-6 bg-black/80 p-10 rounded-2xl w-[420px] shadow-xl animate-fadeIn">
            {/* GIF en la parte superior */}
            <img
            src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHg3M3Y0bTl6ajM5aDN6Y3AwYTNucHJhejM2eThvMGVqaGgybWptcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VJxNm7zrm3K4E/giphy.gif"
            alt="Decorativo animado"
            className="w-28 h-28 object-cover rounded-full border-4 border-yellow-400 shadow-lg"
            />

            <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-400">
                FuturaFree Store
            </h2>
            <p className="text-yellow-300 text-sm italic">
                El rincón del sonido eterno 🎶
            </p>
            </div>

            {error && (
            <div className="mb-4 p-3 bg-red-900 border border-red-400 text-red-200 rounded-md w-full text-sm">
                ❌ {error}
            </div>
            )}

            <form className="w-full space-y-5" noValidate>
            {/* Email */}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
                }}
                onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
                }}
                required
                className="w-full bg-gray-800 text-yellow-100 placeholder-gray-400 border border-yellow-600 rounded-md px-4 py-3 focus:outline-none focus:border-yellow-400"
            />

            {/* Password */}
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
                }}
                onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
                }}
                required
                className="w-full bg-gray-800 text-yellow-100 placeholder-gray-400 border border-yellow-600 rounded-md px-4 py-3 focus:outline-none focus:border-yellow-400"
            />

            {/* Opciones */}
            <div className="flex items-center justify-between text-sm text-yellow-400">
                <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-yellow-500" /> Recuérdame
                </label>
                <a href="#" className="text-yellow-300 hover:text-yellow-200">
                ¿Olvidaste tu contraseña?
                </a>
            </div>

            {/* Botón */}
            <button
                type="button"
                onClick={handleLogin}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-md font-semibold transition duration-300 shadow-lg disabled:opacity-50"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
            </form>

            {/* Registro */}
            <p className="text-center text-sm text-yellow-400 mt-4">
            ¿No tienes cuenta?{" "}
            <Link to="/signup" className="text-yellow-300 hover:text-yellow-200">
                Regístrate
            </Link>
            </p>
        </div>
        </div>
    );
    };

    export default LoginScreen;
