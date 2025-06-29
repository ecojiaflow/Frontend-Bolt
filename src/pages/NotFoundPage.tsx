import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-5xl font-bold text-eco-leaf mb-4">404</h1>
    <p className="text-lg mb-6">Oups ! Cette page n’existe pas.</p>
    <Link to="/" className="px-6 py-3 bg-eco-leaf text-white rounded-lg hover:bg-eco-leaf/90 transition">
      Retour à l’accueil
    </Link>
  </div>
);

export default NotFoundPage;
