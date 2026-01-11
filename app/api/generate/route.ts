import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// !!! API KEY'İ BURAYA DİREKT YAPIŞTIRDIM (ENV DOSYASI SORUNU ÇÖZÜLENE KADAR) !!!
// Bu yöntemle dosya adı derdiniz olmaz, direkt çalışır.
const API_KEY = "AIzaSyBou2j5VUPwMvZE5r36YnnooBVQ9MyqA2w"; 

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { story, petitionType, userName, mode, plaintiffClaims, fileData } = body;

    // Model: gemini-2.5-flash (Kullanıcı isteği üzerine sabitlendi)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: { responseMimeType: "application/json" } 
    });

    let parts: any[] = [];

    // --- SENARYO 1: CEVAP / SAVUNMA YAZMA ---
    if (mode === 'reply') {
        let promptText = `
          ### ROL:
          Sen Türkiye Cumhuriyeti kanunlarına hakim, 20 yıllık tecrübeli bir Avukatsın.
          Müvekkilin (${userName}) adına, kendisine açılan bir davaya veya gönderilen ihtarnamye karşı CEVAP/SAVUNMA dilekçesi yazacaksın.
          
          Konu: ${petitionType}
          Müvekkilin Anlattıkları: ${story}
        `;

        if (plaintiffClaims) {
            promptText += `\nKarşı Tarafın İddiaları: ${plaintiffClaims}\n`;
        }
        
        if (fileData) {
            promptText += `\nEKTEKİ DOSYAYI ANALİZ ET: Ekte sunulan belgeyi oku ve savunmamızda kullan.\n`;
        }

        promptText += `
          ### ÇIKTI KURALLARI:
          1. **Üslup:** Hukuki ve "Netice-i Talep" içeren bir dil kullan.
          2. **Format:** Sadece JSON formatında çıktı ver.
          
          ### JSON FORMATI:
          {
            "institution": "MAKAM ADI",
            "subject": "KONU",
            "body": "Dilekçe metni. \\n ile alt satıra geç.",
            "result": "Sonuç ve İstem."
          }
        `;
        
        parts.push({ text: promptText });

        if (fileData) {
            const base64Data = fileData.split(',')[1]; 
            const mimeType = fileData.split(';')[0].split(':')[1];
            parts.push({ inlineData: { data: base64Data, mimeType: mimeType } });
        }

    } else {
        // --- SENARYO 2: YENİ DİLEKÇE OLUŞTURMA ---
        const promptText = `
          ### ROL:
          Sen uzman bir Arzuhalcisin. Vatandaş (${userName}) adına hukuki bir başvuru dilekçesi yaz.
          Konu: ${petitionType}
          Olay: ${story}
          
          ### JSON FORMATI:
          {
            "institution": "MAKAM ADI",
            "subject": "Konu Özeti",
            "body": "Dilekçe metni. \\n ile alt satıra geç.",
            "result": "Sonuç ve İstem cümlesi."
          }
        `;
        parts.push({ text: promptText });
    }

    const result = await model.generateContent(parts);
    const response = await result.response;
    let text = response.text();
    
    // JSON Temizleme
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        text = text.substring(firstBrace, lastBrace + 1);
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("AI Hatası:", error);
    return NextResponse.json({ error: "İşlem başarısız. Lütfen tekrar deneyin." }, { status: 500 });
  }
}