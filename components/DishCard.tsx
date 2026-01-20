"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DishCardProps {
  id: number;
  name: string;
  desc: string;
  price: number;
  category: string;
  type?: string;
  image: string;
  onAddToCart?: (id: number) => void;
  inCart?: boolean;
  cartQuantity?: number;
  onRemoveFromCart?: (id: number) => void;
  isAvailable?: boolean;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  ingredients?: string[];
  allergens?: string[];
}

export default function DishCard({
  id,
  name,
  desc,
  price,
  category,
  type,
  image,
  onAddToCart,
  inCart = false,
  cartQuantity = 0,
  onRemoveFromCart,
  isAvailable = true,
  nutrition,
  ingredients,
  allergens,
}: DishCardProps) {
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // You can add API call here to save to backend
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group relative ${
        !isAvailable ? "opacity-75" : ""
      }`}
    >
      {/* Availability Overlay */}
      {!isAvailable && (
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
            Currently Unavailable
          </div>
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-tomato-red to-saffron-yellow text-white px-3 py-1 rounded-full font-bold text-sm">
          ₹{price}
        </div>
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-dark-green px-3 py-1 rounded-full font-semibold text-xs">
          {category}
        </div>
        {/* Heart Button */}
        <button
          onClick={toggleFavorite}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg group/heart"
          aria-label={
            isFavorite
              ? t("cart.removeFromFavorites")
              : t("cart.addToFavorites")
          }
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              isFavorite
                ? "fill-tomato-red text-tomato-red scale-110"
                : "text-dark-green/70 group-hover/heart:text-tomato-red group-hover/heart:scale-110"
            }`}
          />
        </button>
      </div>
      <div className="p-5">
        {type && (
          <span className="inline-block bg-warm-beige/50 text-dark-green px-3 py-1 rounded-full font-semibold text-xs mb-2">
            {type}
          </span>
        )}
        <h3 className="font-bold text-dark-green text-lg mb-2">{name}</h3>
        <p className="text-dark-green/60 text-sm mb-4">{desc}</p>

        {/* Nutrition Information */}
        {nutrition && (
          <div className="mb-4">
            <button
              onClick={() => setShowNutrition(!showNutrition)}
              className="text-xs text-tomato-red hover:text-tomato-red/80 font-medium mb-2"
            >
              {showNutrition ? "Hide" : "Show"} Nutrition Info
            </button>
            {showNutrition && (
              <div className="bg-gray-50 rounded-lg p-3 text-xs">
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div>
                    <div className="font-bold text-dark-green">
                      {nutrition.calories}
                    </div>
                    <div className="text-gray-500">Cal</div>
                  </div>
                  <div>
                    <div className="font-bold text-dark-green">
                      {nutrition.protein}g
                    </div>
                    <div className="text-gray-500">Protein</div>
                  </div>
                  <div>
                    <div className="font-bold text-dark-green">
                      {nutrition.carbs}g
                    </div>
                    <div className="text-gray-500">Carbs</div>
                  </div>
                  <div>
                    <div className="font-bold text-dark-green">
                      {nutrition.fat}g
                    </div>
                    <div className="text-gray-500">Fat</div>
                  </div>
                  <div>
                    <div className="font-bold text-dark-green">
                      {nutrition.fiber}g
                    </div>
                    <div className="text-gray-500">Fiber</div>
                  </div>
                </div>
                {allergens && allergens.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-red-600 font-medium">Allergens:</div>
                    <div className="text-gray-600">{allergens.join(", ")}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Availability Status */}
        {!isAvailable && (
          <div className="mb-4 text-center">
            <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              Currently Unavailable
            </span>
          </div>
        )}
        {inCart && cartQuantity > 0 ? (
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemoveFromCart?.(id)}
              className="border-tomato-red text-tomato-red hover:bg-tomato-red hover:text-white"
            >
              <span className="text-lg">−</span>
            </Button>
            <span className="font-bold text-dark-green text-lg flex-1 text-center">
              {cartQuantity}
            </span>
            <Button
              size="sm"
              onClick={() => onAddToCart?.(id)}
              className="bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl"
            >
              <span className="text-lg">+</span>
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => onAddToCart?.(id)}
            disabled={!isAvailable}
            className={`w-full font-semibold ${
              !isAvailable
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-tomato-red to-saffron-yellow text-white hover:shadow-xl"
            }`}
          >
            {!isAvailable ? "Unavailable" : t("cart.addToCart")}
          </Button>
        )}
      </div>
    </div>
  );
}
