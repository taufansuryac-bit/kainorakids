import React from 'react';
import { Instagram, Heart, MessageCircle } from 'lucide-react';

// Static feed option to keep site fast and prevent API token expiration
const IG_POSTS = [
  { id: 1, image: '/banner-hero-1.jpg', likes: '1.2K', comments: 45 },
  { id: 2, image: '/banner-hero-2.jpg', likes: '856', comments: 23 },
  { id: 3, image: '/kainorapark-1.jpg', likes: '2.4K', comments: 120 },
  { id: 4, image: '/kidsclub-1.jpg', likes: '945', comments: 34 },
  { id: 5, image: '/banner-hero-slider-1.jpg', likes: '1.5K', comments: 67 },
  { id: 6, image: '/shop-boys.jpg', likes: '3.1K', comments: 210 },
];

export default function InstagramFeed() {
  return (
    <section className="py-16 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram className="w-8 h-8 text-rose-500" />
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              @kainorakids
            </h2>
          </div>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Ikuti kami di Instagram untuk inspirasi OOTD anak kekinian, info diskon kilat, dan tips parenting seru setiap hari!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {IG_POSTS.map((post) => (
            <a 
              key={post.id}
              href="https://instagram.com/kainorakids" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden block"
            >
              <img 
                src={post.image} 
                alt="Instagram Feed Kainora Kids" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <div className="flex items-center text-white font-semibold">
                  <Heart className="w-5 h-5 mr-1 fill-white" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center text-white font-semibold">
                  <MessageCircle className="w-5 h-5 mr-1 fill-white" />
                  <span>{post.comments}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a 
            href="https://instagram.com/kainorakids" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-3 border-2 border-rose-500 text-rose-500 font-bold rounded-full hover:bg-rose-500 hover:text-white transition-colors"
          >
            <Instagram className="w-5 h-5 mr-2" />
            Follow Instagram Kami
          </a>
        </div>
      </div>
    </section>
  );
}
