    import { useState, useEffect } from 'react';
    import { catalogService, catalogTypeService } from '../services';
    import { useAuth } from '../context/AuthContext';
    import Layout from './Layout';
    import CatalogForm from './CatalogForm';

    const CatalogsList = () => {
    const [catalogs, setCatalogs] = useState([]);
    const [catalogTypes, setCatalogTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [recentlyUpdated, setRecentlyUpdated] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const { validateToken } = useAuth();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (recentlyUpdated) {
        const timer = setTimeout(() => setRecentlyUpdated(null), 2000);
        return () => clearTimeout(timer);
        }
    }, [recentlyUpdated]);

    useEffect(() => {
        if (successMessage) {
        const timer = setTimeout(() => setSuccessMessage(''), 3000);
        return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadData = async () => {
        try {
        setLoading(true);
        setError('');
        const catalogsData = await catalogService.getAll();
        setCatalogs(catalogsData.catalogs);

        try {
            const catalogTypesData = await catalogTypeService.getAll();
            setCatalogTypes(catalogTypesData);
        } catch {
            setCatalogTypes([]);
        }
        } catch (error) {
        setError(error.message || 'Error al cargar los catálogos');
        } finally {
        setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = async (item) => {
        if (!validateToken()) return;
        if (window.confirm(`¿Eliminar catálogo "${item.name}"?`)) {
        try {
            await catalogService.deactivate(item.id);
            await loadData();
            setSuccessMessage('Catálogo eliminado exitosamente');
        } catch (error) {
            setError(error.message || 'Error al eliminar el catálogo');
        }
        }
    };

    const handleFormSuccess = async (savedItem, isEdit = false) => {
        await loadData();
        setRecentlyUpdated(savedItem.id);
        setSuccessMessage(isEdit ? 'Catálogo actualizado exitosamente' : 'Catálogo creado exitosamente');
        setShowForm(false);
        setEditingItem(null);
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingItem(null);
    };

    const getCatalogTypeName = (catalog) => {
        return catalog.catalog_type_description || 'Tipo no encontrado';
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('es-HN', {
        style: 'currency',
        currency: 'HNL',
        }).format(amount);

    const calculateFinalPrice = (cost, discount) => cost - (cost * discount) / 100;

    if (loading) {
        return (
        <div className="flex justify-center items-center min-h-screen text-purple-600 text-lg">
            Cargando catálogos...
        </div>
        );
    }

    return (
        <Layout>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">📦 Catálogos</h1>
            <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium py-2 px-4 rounded-md shadow hover:opacity-90 transition"
            >
            + Nuevo Catálogo
            </button>
        </div>

        {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md shadow-sm">
            ✅ {successMessage}
            </div>
        )}
        {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md shadow-sm">
            ❌ {error}
            </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
                <tr>
                {['Nombre', 'Tipo', 'Costo', 'Descuento', 'Precio Final', 'Estado', 'Acciones'].map((head) => (
                    <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                    {head}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
                {catalogs.length === 0 ? (
                <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No hay catálogos registrados
                    </td>
                </tr>
                ) : (
                catalogs.map((item) => (
                    <tr
                    key={item.id}
                    className={`transition-colors hover:bg-purple-50 ${
                        recentlyUpdated === item.id ? 'bg-green-50' : ''
                    }`}
                    >
                    <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        {getCatalogTypeName(item)}
                        </span>
                    </td>
                    <td className="px-6 py-4">{formatCurrency(item.cost)}</td>
                    <td className="px-6 py-4">
                        {item.discount > 0 ? (
                        <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            {item.discount}%
                        </span>
                        ) : (
                        <span className="text-gray-400">Sin descuento</span>
                        )}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                        {item.discount > 0 ? (
                        <div>
                            <span className="text-green-600">
                            {formatCurrency(calculateFinalPrice(item.cost, item.discount))}
                            </span>
                            <span className="block text-xs text-gray-400 line-through">
                            {formatCurrency(item.cost)}
                            </span>
                        </div>
                        ) : (
                        formatCurrency(item.cost)
                        )}
                    </td>
                    <td className="px-6 py-4">
                        <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            item.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        >
                        {item.active ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                        <button
                        onClick={() => handleEdit(item)}
                        className="text-purple-600 hover:underline"
                        >
                        Editar
                        </button>
                        {item.active && (
                        <button
                            onClick={() => handleDelete(item)}
                            className="text-red-600 hover:underline"
                        >
                            Eliminar
                        </button>
                        )}
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        {showForm && (
            <CatalogForm
            item={editingItem}
            catalogTypes={catalogTypes}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
            />
        )}
        </Layout>
    );
    };

    export default CatalogsList;
