import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Award, Globe } from 'lucide-react';
import { CATEGORIES, CategoryType } from '../types/categories';

interface StatsData {
  totalProducts: number;
  averageScore: number;
  byCategory: Record<string, number>;
  topTags: Array<{ name: string; count: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const StatsPage: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/stats`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }
      
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Erreur stats:', err);
      setError('Impossible de charger les statistiques');
      
      // Données de démonstration SÉCURISÉES
      setStats({
        totalProducts: 59,
        averageScore: 0.68,
        byCategory: {
          alimentaire: 25,
          cosmetique: 15,
          mode: 8,
          maison: 6,
          electronique: 3,
          sport: 2
        },
        topTags: [
          { name: 'bio', count: 32 },
          { name: 'naturel', count: 28 },
          { name: 'vegan', count: 18 },
          { name: 'local', count: 15 },
          { name: 'durable', count: 12 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryData = () => {
    // VÉRIFICATION SÉCURISÉE
    if (!stats?.byCategory || typeof stats.byCategory !== 'object') {
      return [];
    }
    
    return Object.entries(stats.byCategory).map(([key, count]) => ({
      name: CATEGORIES[key as CategoryType]?.name || key,
      count: count || 0,
      icon: CATEGORIES[key as CategoryType]?.icon || '📦'
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchStats}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📊 Statistiques Ecolojia
          </h1>
          <p className="text-xl text-gray-600">
            Aperçu de notre base de données de produits éco-responsables
          </p>
        </div>

        {/* Cards Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Produits</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Score Moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.averageScore ? (stats.averageScore * 100).toFixed(0) : 0}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Catégories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.byCategory ? Object.keys(stats.byCategory).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tags Uniques</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.topTags?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Répartition par catégorie - Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répartition par Catégorie
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getCategoryData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par catégorie - Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribution des Catégories
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getCategoryData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {getCategoryData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Tags */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tags les Plus Populaires
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats?.topTags?.map((tag, index) => (
              <div key={tag.name} className="text-center">
                <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                  {tag.name}
                </div>
                <p className="text-gray-600 text-sm mt-1">{tag.count} produits</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Découvrez nos produits éco-responsables</h3>
            <p className="text-lg mb-6">
              Plus de {stats?.totalProducts || 0} produits analysés par notre IA pour vous aider à consommer mieux
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Explorer les produits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;