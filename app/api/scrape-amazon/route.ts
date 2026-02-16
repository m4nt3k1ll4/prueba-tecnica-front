import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

/**
 * API Route para Web Scraping de Amazon
 * 
 * Mejoras anti-detección:
 * - User-Agents rotativos actualizados (Chrome, Edge, Firefox, Safari)
 * - Headers completos simulando navegador real (Sec-Ch-Ua, Referer, DNT, etc.)
 * - Delay aleatorio entre peticiones (500-1500ms)
 * - Detección de páginas CAPTCHA/bloqueo
 * - Múltiples selectores CSS para diferentes layouts de Amazon
 * - Limpieza de espacios y caracteres especiales
 */

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "URL es requerida" },
        { status: 400 }
      );
    }

    // Validar que sea una URL de Amazon
    if (!url.match(/amazon\.(com|es|co\.uk|de|fr|it|ca|co\.jp|com\.mx|com\.br)/i)) {
      return NextResponse.json(
        { success: false, message: "URL debe ser de Amazon" },
        { status: 400 }
      );
    }

    // Extraer dominio de Amazon para headers más específicos
    const amazonDomain = url.match(/amazon\.(com|es|co\.uk|de|fr|it|ca|co\.jp|com\.mx|com\.br)/i)?.[0] || "amazon.com";

    // User-Agents rotativos más actualizados (2026)
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
    ];
    
    // Seleccionar un User-Agent aleatorio
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

    // Headers mejorados para simular un navegador real moderno
    const headers: Record<string, string> = {
      "User-Agent": randomUserAgent,
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Language": "es-ES,es;q=0.9,en-US;q=0.8,en;q=0.7",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Referer": `https://www.${amazonDomain}/`,
      "DNT": "1",
      "Connection": "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-User": "?1",
      "Sec-Ch-Ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Cache-Control": "max-age=0",
      "Priority": "u=0, i",
    };

    // Hacer la petición a Amazon con delay aleatorio para evitar detección
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
    
    const response = await fetch(url, {
      headers,
      redirect: "follow",
      // Agregar credenciales para simular navegador
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Error al acceder a Amazon" },
        { status: 500 }
      );
    }

    const html = await response.text();
    
    // Verificar si Amazon bloqueó la petición (página de CAPTCHA o error)
    if (html.includes("api-services-support@amazon.com") || 
        html.includes("Sorry, we just need to make sure you're not a robot") ||
        html.includes("Enter the characters you see below")) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Amazon detectó la petición automática. Intenta con un proxy o espera unos minutos." 
        },
        { status: 429 }
      );
    }

    const $ = cheerio.load(html);

    // Extraer información del producto
    let title = "";
    let description = "";
    let price = "";
    let rating = "";
    const features: string[] = [];

    // Título del producto - múltiples selectores
    title = $("#productTitle").text().trim() || 
            $("h1#title").text().trim() ||
            $("h1.product-title").text().trim() ||
            $("span#productTitle").text().trim() ||
            $("h1[data-feature-name='title']").text().trim() ||
            $("h1").first().text().trim();

    // Precio - múltiples selectores para diferentes layouts de Amazon
    price = $(".a-price .a-offscreen").first().text().trim() ||
            $(".a-price-whole").first().text().trim() ||
            $("#priceblock_ourprice").text().trim() ||
            $("#priceblock_dealprice").text().trim() ||
            $("#price_inside_buybox").text().trim() ||
            $(".a-price[data-a-size='xl'] .a-offscreen").text().trim() ||
            $("span.priceToPay .a-offscreen").text().trim() ||
            $("#corePrice_feature_div .a-offscreen").first().text().trim();

    // Rating - múltiples selectores
    rating = $("span.a-icon-alt").first().text().trim() ||
             $("#acrPopover").attr("title") || 
             $("i[data-hook='average-star-rating'] span").text().trim() ||
             $(".a-icon-star span").first().text().trim() ||
             "";

    // Características del producto - múltiples ubicaciones posibles
    $("#feature-bullets ul li, #feature-bullets li, .a-unordered-list.a-vertical li").each((_, element) => {
      const feature = $(element).text().trim().replace(/\s+/g, ' ');
      if (feature && feature.length > 5 && !feature.includes('Make sure') && features.length < 8) {
        features.push(feature);
      }
    });

    // Si no hay features en feature-bullets, buscar en otras ubicaciones
    if (features.length === 0) {
      $("#productDetails_feature_div li, .detail-bullet-list li").each((_, element) => {
        const feature = $(element).text().trim().replace(/\s+/g, ' ');
        if (feature && feature.length > 5 && features.length < 8) {
          features.push(feature);
        }
      });
    }

    // Descripción del producto - múltiples selectores
    description = $("#productDescription p").text().trim() ||
                  $("#productDescription").text().trim() ||
                  $("#feature-bullets").text().trim() ||
                  $(".a-section.a-spacing-medium").first().text().trim() ||
                  $("#aplus_feature_div").text().trim().substring(0, 500) ||
                  "";
    
    // Limpiar descripción de espacios extra
    description = description.replace(/\s+/g, ' ').trim();

    // Construir descripción formateada
    let formattedDescription = "";

    if (title) {
      formattedDescription += `🛒 ${title}\n\n`;
    }

    if (price) {
      formattedDescription += `💰 Precio: ${price}\n`;
    }

    if (rating) {
      formattedDescription += `⭐ ${rating}\n`;
    }

    if (features.length > 0) {
      formattedDescription += `\n✨ Características principales:\n`;
      features.slice(0, 5).forEach((feature) => {
        formattedDescription += `• ${feature}\n`;
      });
    }

    if (description && description.length > 50) {
      formattedDescription += `\n📋 Descripción:\n${description.substring(0, 500)}${description.length > 500 ? "..." : ""}`;
    }

    // Si no se extrajo información, dar un mensaje
    if (!formattedDescription || formattedDescription.length < 20) {
      formattedDescription = 
        "⚠️ No se pudo extraer información completa de esta página de Amazon.\n\n" +
        "Esto puede deberse a:\n" +
        "• La estructura de la página es diferente\n" +
        "• Amazon está bloqueando el scraping\n" +
        "• La URL no corresponde a un producto\n\n" +
        "💡 Intenta con otra URL o producto de Amazon.";
    }

    return NextResponse.json({
      success: true,
      data: {
        description: formattedDescription,
        title,
        price,
        rating,
        features: features.slice(0, 5),
      }
    });

  } catch (error) {
    console.error("Error en scraping de Amazon:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Error al procesar la página de Amazon",
        error: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  }
}
