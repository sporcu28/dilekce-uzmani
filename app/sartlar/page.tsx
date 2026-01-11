import { AlertTriangle } from 'lucide-react'

export const metadata = {
  title: 'Kullanım Koşulları | LexDraft Pro',
  description: 'Hizmet kullanım şartları ve yasal sorumluluk reddi.',
}

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto py-16 px-6 font-sans">
      <div className="text-center mb-12">
        <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Kullanım Koşulları</h1>
        <p className="text-slate-500 mt-2">Lütfen dikkatlice okuyunuz.</p>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Hizmetin Niteliği</h2>
            <p>
                LexDraft Pro, yapay zeka teknolojisi kullanarak taslak hukuki metinler oluşturan bir yazılımdır. 
                <strong>Bu site bir avukat veya hukuk bürosu değildir.</strong> Sunulan hizmet, hukuki danışmanlık yerine geçmez.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Sorumluluk Reddi</h2>
            <p className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-900 font-medium">
                Oluşturulan belgelerin doğruluğu, güncelliği ve hukuki geçerliliği garanti edilmez. 
                Bu belgelerin kullanımından doğabilecek hak kayıpları, maddi veya manevi zararlardan 
                LexDraft Pro ve geliştiricileri sorumlu tutulamaz.
            </p>
            <p className="mt-4">
                Resmi işlemleriniz, dava açma veya savunma süreçleriniz için mutlaka yetkili bir avukattan profesyonel destek almanız önerilir.
            </p>
        </section>

        <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Kullanıcı Beyanı</h2>
            <p>
                Bu siteyi kullanan herkes, oluşturduğu içeriğin sorumluluğunun tamamen kendisine ait olduğunu, 
                sistemin sadece bir araç (editör) olduğunu kabul etmiş sayılır.
            </p>
        </section>
      </div>
    </main>
  )
}