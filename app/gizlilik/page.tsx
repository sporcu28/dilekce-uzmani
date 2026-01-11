import { ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'Gizlilik Politikası | LexDraft Pro',
  description: 'LexDraft Pro veri güvenliği ve gizlilik politikası.',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-6 font-sans">
      <div className="text-center mb-12">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Gizlilik Politikası</h1>
        <p className="text-slate-500 mt-2">Son Güncelleme: 2026</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Veri Toplama ve Kullanım</h2>
            <p>
                LexDraft Pro ("Sistem"), kullanıcıların girdiği verileri (Ad, Soyad, TC, Olay Bilgisi) 
                <strong>sadece o anlık dilekçe oluşturma işlemi</strong> için kullanır. Bu veriler:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Sunucularımızda <strong>kaydedilmez.</strong></li>
                <li>Üçüncü şahıslarla paylaşılmaz.</li>
                <li>İşlem tamamlandığında (sayfa yenilendiğinde) silinir.</li>
            </ul>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Yapay Zeka (AI) İşlemleri</h2>
            <p>
                Dilekçe oluşturma sürecinde girilen metinler, işlenmek üzere Google Gemini AI servisine gönderilir. 
                Bu işlem şifreli (SSL) bağlantı üzerinden yapılır. AI servisi bu verileri kendi modelini eğitmek için kullanmaz.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Çerezler (Cookies)</h2>
            <p>
                Sitemiz, kullanıcı deneyimini iyileştirmek amacıyla temel düzeyde çerezler kullanabilir. 
                Kullanıcılar tarayıcı ayarlarından çerezleri diledikleri zaman silebilirler.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. İletişim</h2>
            <p>
                Gizlilik politikamızla ilgili sorularınız için <strong>info@dilekceuzmani.com</strong> 
                adresinden bize ulaşabilirsiniz.
            </p>
        </section>
      </div>
    </main>
  )
}