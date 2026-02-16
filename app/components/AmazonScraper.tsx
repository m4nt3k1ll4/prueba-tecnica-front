"use client";

import { useState } from "react";
import { FiLoader } from "react-icons/fi";

interface AmazonScraperProps {
  initialUrl?: string;
  initialDescription?: string;
  onFeaturesExtracted?: (features: string) => void;
  onPriceExtracted?: (price: string) => void;
  onScrapingStateChange?: (isLoading: boolean) => void;
}

export function AmazonScraper({
  initialUrl = "",
  initialDescription = "",
  onFeaturesExtracted,
  onPriceExtracted,
  onScrapingStateChange,
}: AmazonScraperProps) {
  const [amazonUrl, setAmazonUrl] = useState(initialUrl);
  const [amazonDescription, setAmazonDescription] = useState(initialDescription);
  const [isScrapingAmazon, setIsScrapingAmazon] = useState(false);

  const handleAmazonUrlChange = async (url: string) => {
    setAmazonUrl(url);
    
    // Validar que sea una URL de Amazon válida
    if (!url || !url.match(/amazon\.(com|es|co\.uk|de|fr|it|ca|co\.jp|com\.mx|com\.br)/i)) {
      if (url && url.length > 10) {
        setAmazonDescription("⚠️ Por favor ingresa una URL válida de Amazon");
      }
      return;
    }

    setIsScrapingAmazon(true);
    onScrapingStateChange?.(true);
    setAmazonDescription("🔍 Extrayendo información de Amazon...");
    
    try {
      const response = await fetch("/api/scrape-amazon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (result.success && result.data?.description) {
        setAmazonDescription(result.data.description);
        
        // Llenar características si están disponibles
        if (result.data.features && result.data.features.length > 0) {
          const featuresText = result.data.features.join("\n• ");
          const formattedFeatures = "• " + featuresText;
          onFeaturesExtracted?.(formattedFeatures);
        }
        
        // Llenar precio si está disponible
        if (result.data.price) {
          // Extraer solo números y punto decimal del precio
          const priceMatch = result.data.price.match(/[0-9]+\.?[0-9]*/);  
          if (priceMatch) {
            onPriceExtracted?.(priceMatch[0]);
          }
        }
      } else {
        setAmazonDescription(
          "❌ No se pudo extraer información de esta URL\n\n" +
          (result.message || "Intenta con otra URL de producto de Amazon")
        );
      }
    } catch (error) {
      console.error("Error al hacer scraping:", error);
      setAmazonDescription(
        "❌ Error al conectar con el servidor de scraping\n\n" +
        "Por favor verifica tu conexión e intenta nuevamente."
      );
    } finally {
      setIsScrapingAmazon(false);
      onScrapingStateChange?.(false);
    }
  };

  return (
    <div className="group rounded-xl border-2 border-amber-700/40 bg-linear-to-br from-amber-900/20 to-amber-950/10 p-5 shadow-lg transition-all hover:border-amber-600/50 hover:shadow-amber-900/20">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-500/20 p-2.5 ring-1 ring-amber-500/30">
            <span className="text-2xl">🌐</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-400">Web Scraping Amazon</h3>
            <p className="mt-0.5 text-xs text-zinc-400">Extracción automática de datos</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
            Real-time
          </span>
          <span className="text-[10px] font-medium text-zinc-500">Powered by Cheerio</span>
        </div>
      </div>
      
      {/* Info Banner */}
      <div className="mb-4 rounded-lg border border-amber-700/30 bg-amber-950/30 p-3">
        <div className="flex items-start gap-2">
          <span className="text-sm">⚠️</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-amber-300">Solo URLs de Amazon</p>
            <p className="mt-1 text-[11px] leading-relaxed text-zinc-400">
              Compatible con: amazon.com, amazon.es, amazon.co.uk, amazon.de, amazon.fr, amazon.it, amazon.ca, amazon.co.jp, amazon.com.mx, amazon.com.br
            </p>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-md bg-zinc-900/50 p-2 text-center">
          <div className="text-lg">💰</div>
          <p className="mt-1 text-[10px] font-medium text-zinc-400">Precio</p>
        </div>
        <div className="rounded-md bg-zinc-900/50 p-2 text-center">
          <div className="text-lg">✨</div>
          <p className="mt-1 text-[10px] font-medium text-zinc-400">Features</p>
        </div>
        <div className="rounded-md bg-zinc-900/50 p-2 text-center">
          <div className="text-lg">📋</div>
          <p className="mt-1 text-[10px] font-medium text-zinc-400">Descripción</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Amazon URL */}
        <div>
          <label
            htmlFor="amazon_url"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            URL de Amazon
          </label>
          <input
            id="amazon_url"
            name="amazon_url"
            type="url"
            value={amazonUrl}
            onChange={(e) => handleAmazonUrlChange(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            placeholder="https://www.amazon.com/..."
          />
        </div>

        {/* Amazon Description */}
        <div>
          <label
            htmlFor="amazon_description"
            className="mb-1.5 flex items-center gap-2 text-sm font-medium text-zinc-300"
          >
            Descripción extraída de Amazon
            {isScrapingAmazon && (
              <span className="flex items-center gap-1 text-xs text-amber-400">
                <FiLoader className="h-3 w-3 animate-spin" />
                Extrayendo...
              </span>
            )}
          </label>
          <textarea
            id="amazon_description"
            name="amazon_description"
            rows={6}
            value={amazonDescription}
            onChange={(e) => setAmazonDescription(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors resize-none"
            placeholder="La información del producto se extraerá automáticamente mediante web scraping real..."
          />
        </div>
      </div>
    </div>
  );
}
