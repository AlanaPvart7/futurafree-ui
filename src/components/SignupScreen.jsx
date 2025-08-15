    import { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { useAuth } from "../context/AuthContext";
    import { isValidEmail, validatePassword, getPasswordStrength } from "../utils/validators";

    const SignupScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
        if (error) setError('');
    };

    const handleSignup = async () => {
        if (isSubmitting) return;

        setError('');
        setSuccess('');
        setIsSubmitting(true);

        if (!formData.name.trim()) return setErrorAndStop('El nombre es requerido');
        if (!formData.lastname.trim()) return setErrorAndStop('El apellido es requerido');
        if (!formData.email.trim()) return setErrorAndStop('El email es requerido');
        if (!isValidEmail(formData.email)) return setErrorAndStop('Por favor ingresa un email válido');

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) return setErrorAndStop(passwordValidation.message);

        if (formData.password !== formData.confirmPassword)
        return setErrorAndStop('Las contraseñas no coinciden');

        try {
        const result = await register(formData.name, formData.lastname, formData.email, formData.password);
        if (result) {
            setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');
            setFormData({ name: '', lastname: '', email: '', password: '', confirmPassword: '' });
            setTimeout(() => navigate('/login', { replace: true }), 1500);
        }
        } catch (error) {
        setError(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
        } finally {
        setIsSubmitting(false);
        }
    };

    const setErrorAndStop = (msg) => {
        setError(msg);
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-zinc-900 rounded-lg overflow-hidden shadow-lg border border-yellow-600">
            
            {/* GIF Izquierdo */}
            <div
            className="hidden lg:block lg:w-5/12 bg-cover"
            style={{
                backgroundImage: "url('https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHg3M3Y0bTl6ajM5aDN6Y3AwYTNucHJhejM2eThvMGVqaGgybWptcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VJxNm7zrm3K4E/giphy.gif')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            ></div>

            {/* Formulario */}
            <div className="w-full lg:w-7/12 p-8">
            <h1 className="text-3xl font-bold text-yellow-500 text-center mb-6">FuturaFree</h1>
            <p className="text-yellow-300 text-center mb-6">Crear cuenta nueva</p>

            {error && (
                <div className="mb-4 p-3 bg-red-900 border border-red-400 text-red-200 rounded-md">
                <div className="flex items-center">
                    <span className="mr-2">❌</span>
                    <span>{error}</span>
                </div>
                {(error.includes('email ya está registrado') || error.includes('usuario ya existe')) && (
                    <div className="mt-2 text-sm">
                    <Link to="/login" className="text-yellow-400 underline hover:text-yellow-500">
                        ¿Ya tienes cuenta? Inicia sesión aquí
                    </Link>
                    </div>
                )}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-900 border border-green-500 text-green-300 rounded-md">
                <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    <span>{success}</span>
                </div>
                </div>
            )}

            <form className="space-y-4" noValidate>
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-yellow-400 mb-1">Nombre</label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-black border border-yellow-600 rounded-md text-yellow-100 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    placeholder="Juan"
                    />
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-yellow-400 mb-1">Apellido</label>
                    <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-black border border-yellow-600 rounded-md text-yellow-100 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    placeholder="Pérez"
                    />
                </div>
                </div>

                <div>
                <label htmlFor="email" className="block text-sm font-medium text-yellow-400 mb-1">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-black border border-yellow-600 rounded-md text-yellow-100 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    placeholder="usuario@example.com"
                />
                </div>

                <div>
                <label htmlFor="password" className="block text-sm font-medium text-yellow-400 mb-1">Contraseña</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-black border border-yellow-600 rounded-md text-yellow-100 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    placeholder="••••••••"
                />
                {formData.password && (
                    <div className="mt-2 text-sm text-yellow-300 space-y-1">
                    {(() => {
                        const strength = getPasswordStrength(formData.password);
                        return (
                        <>
                            <p className={`${strength.isValidLength ? 'text-green-400' : 'text-yellow-500'}`}>
                            {strength.isValidLength ? '✓' : '○'} 8-64 caracteres
                            </p>
                            <p className={`${strength.hasUppercase ? 'text-green-400' : 'text-yellow-500'}`}>
                            {strength.hasUppercase ? '✓' : '○'} Al menos una mayúscula
                            </p>
                            <p className={`${strength.hasNumber ? 'text-green-400' : 'text-yellow-500'}`}>
                            {strength.hasNumber ? '✓' : '○'} Al menos un número
                            </p>
                            <p className={`${strength.hasSpecialChar ? 'text-green-400' : 'text-yellow-500'}`}>
                            {strength.hasSpecialChar ? '✓' : '○'} Carácter especial (@$!%*?&)
                            </p>
                        </>
                        );
                    })()}
                    </div>
                )}
                </div>

                <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-yellow-400 mb-1">
                    Confirmar Contraseña
                </label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-black border border-yellow-600 rounded-md text-yellow-100 placeholder-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    placeholder="••••••••"
                    onKeyDown={(e) => {
                    if (e.key === "Enter") handleSignup();
                    }}
                />
                </div>

                <button
                type="button"
                onClick={handleSignup}
                disabled={isSubmitting}
                className="w-full bg-yellow-500 text-black py-2 px-4 rounded-md hover:bg-yellow-600 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
            </form>

            <p className="text-center text-sm text-yellow-400 mt-4">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-yellow-300 hover:text-yellow-400 underline">
                Inicia sesión
                </Link>
            </p>
            </div>
        </div>
        </div>
    );
    };

    export default SignupScreen;
