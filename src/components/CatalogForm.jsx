import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { catalogService } from '../services';

const CatalogForm = ({ item, catalogTypes, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        id_catalog_type: item?.id_catalog_type || '',
        name: item?.name || '',
        description: item?.description || '',
        cost: item?.cost || '',
        discount: item?.discount || 0,
        active: item?.active ?? true
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { validateToken } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;

        if (!validateToken()) return;

        if (!formData.id_catalog_type.trim()) {
            setError('El tipo de catálogo es requerido');
            return;
        }
        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        const namePattern = /^[0-9A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
        if (!namePattern.test(formData.name)) {
            setError('El nombre solo puede contener letras, números, espacios, apostrofes y guiones');
            return;
        }

        if (!formData.description.trim()) {
            setError('La descripción es requerida');
            return;
        }

        if (!formData.cost || parseFloat(formData.cost) <= 0) {
            setError('El costo debe ser mayor a 0');
            return;
        }
        if (parseFloat(formData.cost) > 999999.99) {
            setError('El costo no puede ser mayor a 999,999.99');
            return;
        }

        const discount = parseInt(formData.discount) || 0;
        if (discount < 0 || discount > 100) {
            setError('El descuento debe estar entre 0 y 100');
            return;
        }

        setIsSubmitting(true);
        try {
            setError('');
            let savedItem;
            if (item) {
                savedItem = await catalogService.update(item.id, formData);
                if (!savedItem) savedItem = { ...item, ...formData };
                onSuccess(savedItem, true);
            } else {
                savedItem = await catalogService.create(formData);
                if (!savedItem) {
                    savedItem = { id: Date.now().toString(), ...formData };
                }
                onSuccess(savedItem, false);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            setError(error.message || 'Error al guardar el catálogo');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isSubmitting) handleSubmit();
        if (e.key === 'Escape') onCancel();
    };

    const activeCatalogTypes = catalogTypes.filter(type => type.active);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-blue-900/80 to-blue-800/80 backdrop-blur-xl border border-blue-500/30 shadow-2xl rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        {item ? '✏️ Editar Catálogo' : '📦 Nuevo Catálogo'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-200 rounded-lg">
                            <div className="flex items-center gap-2">
                                <span>❌</span>
                                <span>{error}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="id_catalog_type" className="block text-sm font-medium text-gray-200 mb-1">
                                Tipo de Catálogo *
                            </label>
                            <select
                                id="id_catalog_type"
                                name="id_catalog_type"
                                value={formData.id_catalog_type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-blue-950/50 border border-blue-500/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                required
                            >
                                <option value="">Seleccionar tipo...</option>
                                {activeCatalogTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.description}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
                                Nombre *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                className="w-full px-4 py-2 rounded-lg bg-blue-950/50 border border-blue-500/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                placeholder="Ej: Frank Ocean - Channel Orange"
                                maxLength="100"
                                autoFocus={!item}
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
                                Descripción *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-4 py-2 rounded-lg bg-blue-950/50 border border-blue-500/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                placeholder="Descripción detallada..."
                                maxLength="500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cost" className="block text-sm font-medium text-gray-200 mb-1">
                                    Costo (HNL) *
                                </label>
                                <input
                                    type="number"
                                    id="cost"
                                    name="cost"
                                    value={formData.cost}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-4 py-2 rounded-lg bg-blue-950/50 border border-blue-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    min="0.01"
                                    max="999999.99"
                                    step="0.01"
                                />
                            </div>

                            <div>
                                <label htmlFor="discount" className="block text-sm font-medium text-gray-200 mb-1">
                                    Descuento (%)
                                </label>
                                <input
                                    type="number"
                                    id="discount"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                    className="w-full px-4 py-2 rounded-lg bg-blue-950/50 border border-blue-500/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        {formData.cost && formData.discount > 0 && (
                            <div className="p-3 bg-cyan-500/20 border border-cyan-400/30 rounded-lg">
                                <div className="text-sm text-cyan-100">
                                    <strong>Vista previa del precio:</strong>
                                </div>
                                <div className="text-lg font-medium text-white">
                                    <span className="line-through text-gray-400 mr-2">
                                        L. {parseFloat(formData.cost).toFixed(2)}
                                    </span>
                                    L. {(parseFloat(formData.cost) * (1 - formData.discount / 100)).toFixed(2)}
                                    <span className="text-sm text-cyan-300 ml-2">
                                        ({formData.discount}% descuento)
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={handleChange}
                                className="h-4 w-4 text-cyan-400 focus:ring-cyan-400 border-gray-300 rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-200">
                                Activo
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-600/50 hover:bg-gray-500 rounded-lg transition-all"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition-transform rounded-lg disabled:opacity-50"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CatalogForm;
