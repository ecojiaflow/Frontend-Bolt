import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <div className="bg-white p-8 rounded-lg">
            <div className="flex items-center justify-center mb-8">
              <Leaf className="h-32 w-32 text-eco-leaf" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Produit Bio</h1>
            <p className="text-gray-600 mb-4">Description du produit eco-responsable</p>
            <div className="text-2xl font-bold text-eco-leaf">8.90 EUR</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;