'use client'
import { useState, useRef, useEffect } from 'react'
import { 
  FileText, Gavel, Home as HomeIcon, ShoppingBag, 
  AlertTriangle, ShieldCheck, Printer, ArrowLeft, ArrowRight, 
  CheckCircle, UploadCloud, FileType, FileDown, AlertCircle, X, HelpCircle, ChevronDown, Smartphone
} from 'lucide-react'

// --- KATEGORİLER ---
const CATEGORIES = [
  { id: 'kira', label: 'Kira & Konut', icon: <HomeIcon className="w-6 h-6"/>, desc: 'Tahliye, kira tespiti, aidat...' },
  { id: 'tuketici', label: 'Tüketici Hakları', icon: <ShoppingBag className="w-6 h-6"/>, desc: 'Ayıplı ürün, iade, servis...' },
  { id: 'alacak', label: 'Borç & İcra', icon: <FileText className="w-6 h-6"/>, desc: 'Borca itiraz, alacak davası...' },
  { id: 'ceza', label: 'Suç Duyurusu', icon: <AlertTriangle className="w-6 h-6"/>, desc: 'Hakaret, tehdit, dolandırıcılık...' },
  { id: 'istifa', label: 'İş & İstifa', icon: <div className="text-xl font-bold px-2">İ</div>, desc: 'İstifa dilekçesi, işe iade...' },
]

// --- SEO İÇİN SIKÇA SORULAN SORULAR ---
const FAQ_DATA = [
    { q: "Dilekçe Asistanım nasıl çalışır?", a: "Yapay zeka teknolojisi ile HMK standartlarına uygun dilekçe taslakları oluşturur. Siz sorununuzu anlatırsınız, sistem hukuki dille yazar." },
    { q: "İstifa dilekçesi örneği hazırlayabilir miyim?", a: "Evet, 'İş & İstifa' kategorisini seçerek ihbar süresine uygun profesyonel istifa dilekçesi oluşturabilirsiniz." },
    { q: "Mobil uygulamanız var mı?", a: "Evet, Google Play Store'dan 'Dilekçe Asistanım' uygulamasını ücretsiz indirebilirsiniz." },
]

export default function Page() {
  const [step, setStep] = useState(1)
  const [mode, setMode] = useState<'create' | 'reply'>('create')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [loading, setLoading] = useState(false)
  const [showLegalModal, setShowLegalModal] = useState(true)
  const [showCookieBanner, setShowCookieBanner] = useState(true)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const resultRef = useRef<HTMLTextAreaElement>(null)
  
  const [formData, setFormData] = useState({
    name: '', tc: '', address: '', defendant: '',
    story: '', plaintiffClaims: '',
    fileData: null as string | null, fileName: '',
    institution: '', subject: '', body: '', result: ''
  })

  useEffect(() => {
    if (bodyRef.current) { bodyRef.current.style.height = "auto"; bodyRef.current.style.height = bodyRef.current.scrollHeight + "px"; }
    if (resultRef.current) { resultRef.current.style.height = "auto"; resultRef.current.style.height = resultRef.current.scrollHeight + "px"; }
  }, [formData.body, formData.result, step])

  const handlePaperChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 4 * 1024 * 1024) return alert("Dosya 4MB'dan küçük olmalı.")
      const reader = new FileReader()
      reader.onloadend = () => setFormData(prev => ({ ...prev, fileData: reader.result as string, fileName: file.name }))
      reader.readAsDataURL(file)
    }
  }

  const downloadAsWord = () => {
    const printContent = document.getElementById('print-area');
    if (!printContent) return;
    const clone = printContent.cloneNode(true) as HTMLElement;
    const inputs = clone.querySelectorAll('input, textarea');
    inputs.forEach((input: any) => {
        const span = document.createElement('span');
        span.innerText = input.value;
        span.style.whiteSpace = "pre-wrap";
        input.parentNode?.replaceChild(span, input);
    });
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Dilekçe</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + clone.innerHTML + footer;
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent('\ufeff' + sourceHTML);
    const link = document.createElement("a");
    link.href = source;
    link.download = `dilekce_${formData.name.replace(/\s+/g, '_') || 'belge'}.doc`;
    link.click();
  }

  const handleGenerate = async () => {
    if (!formData.story && !formData.plaintiffClaims && !formData.fileData) return alert("Lütfen olayı anlatın veya dosya yükleyin.")
    if (!formData.name) return alert("Ad Soyad giriniz.")
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            mode, petitionType: category.label, userName: formData.name,
            story: formData.story, plaintiffClaims: formData.plaintiffClaims, fileData: formData.fileData
        })
      })
      const data = await res.json()
      if(data.error) throw new Error(data.error)
      setFormData(prev => ({ ...prev, institution: data.institution, subject: data.subject, body: data.body, result: data.result }))
      setStep(4)
    } catch (error: any) {
      alert("Hata: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* YASAL UYARI MODALI */}
      {showLegalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative">
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-amber-100 p-3 rounded-full mb-4"><AlertTriangle className="w-10 h-10 text-amber-600" /></div>
                    <h2 className="text-2xl font-bold text-slate-900">Yasal Sorumluluk Reddi</h2>
                </div>
                <div className="text-slate-600 text-sm leading-relaxed space-y-4 mb-8 border p-4 rounded-lg bg-slate-50 max-h-[40vh] overflow-y-auto">
                    <p><strong>1. Bilgilendirme Amaçlıdır:</strong> "Dilekçe Asistanım", yapay zeka teknolojisi kullanarak taslak metinler oluşturur. Bu metinler kesinlikle hukuki tavsiye niteliğinde değildir.</p>
                    <p><strong>2. Avukat Değildir:</strong> Sistem bir avukat veya hukuk bürosu değildir. Oluşturulan belgelerin hukuki geçerliliği, doğruluğu veya güncelliği garanti edilmez.</p>
                    <p><strong>3. Hak Kaybı Riski:</strong> Hukuki süreçler sürelere tabidir. Belgelerin yanlış kullanımından doğabilecek hak kayıplarından kullanıcı sorumludur. Resmi işlemleriniz için bir avukata danışmanız önerilir.</p>
                    <p><strong>4. Veri Gizliliği:</strong> Girdiğiniz veriler sunucularımızda saklanmaz, işlem bittiğinde silinir.</p>
                </div>
                <button onClick={() => setShowLegalModal(false)} className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                    Okudum, Anladım ve Kabul Ediyorum
                </button>
            </div>
        </div>
      )}

      {/* ÇEREZ UYARISI */}
      {showCookieBanner && (
        <div className="fixed bottom-4 right-4 md:right-8 md:w-96 bg-white p-5 rounded-xl shadow-2xl border border-slate-200 z-[90] flex flex-col gap-4 animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-start">
                <p className="text-xs text-slate-600 font-medium leading-relaxed pr-4">
                    Size daha iyi hizmet sunmak için çerezleri kullanıyoruz. Detaylar için <a href="/gizlilik" target="_blank" className="text-primary underline">Gizlilik Politikamızı</a> inceleyebilirsiniz.
                </p>
                <button onClick={() => setShowCookieBanner(false)}><X className="w-4 h-4 text-slate-400 hover:text-slate-900"/></button>
            </div>
            <div className="flex gap-2"><button onClick={() => setShowCookieBanner(false)} className="flex-1 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg">Anladım</button></div>
        </div>
      )}

      {/* HEADER */}
      <header className="h-16 flex items-center justify-between border-b border-slate-200 bg-white px-6 shrink-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-primary/10 p-2 rounded-lg text-primary"><Gavel className="w-6 h-6" /></div>
          <h1 className="text-xl font-bold tracking-tight">Dilekçe<span className="text-primary">Asistanım</span></h1>
        </div>
        
        {/* Google Play Butonu (Header'da da olsun) */}
        <a href="https://play.google.com/store/apps/details?id=com.erhangunes.dilekce" target="_blank" className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
            <Smartphone className="w-4 h-4" /> Uygulamayı İndir
        </a>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <section className={`flex flex-col bg-white border-r border-slate-200 relative transition-all duration-300 ${step === 4 ? 'hidden lg:flex w-1/3' : 'w-full lg:w-1/2'}`}>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
                {step === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-extrabold text-slate-900">Dilekçe Asistanım: AI & PDF</h1>
                            <p className="text-slate-500">Yapay zeka ile saniyeler içinde dilekçe örneği oluşturun.</p>
                        </div>
                        
                        {/* ANDROID APP PROMOSYONU */}
                        <a href="https://play.google.com/store/apps/details?id=com.erhangunes.dilekce" target="_blank" className="block p-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white shadow-lg relative overflow-hidden group hover:shadow-xl transition-all">
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Smartphone className="w-5 h-5"/> Mobil Uygulamayı İndirin</h3>
                                    <p className="text-blue-100 text-sm">Dilekçenizi cebinizden oluşturun, her an yanınızda olsun.</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-full"><ArrowRight className="w-5 h-5"/></div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/20 transition-all"></div>
                        </a>

                        <div className="grid md:grid-cols-2 gap-4">
                            <button onClick={() => { setMode('create'); setStep(2); }} className="p-6 bg-blue-50 border-2 border-blue-100 hover:border-primary hover:bg-white rounded-2xl text-left transition-all hover:shadow-lg group">
                                <div className="size-12 bg-white text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div><h3 className="text-lg font-bold text-slate-800">Dilekçe Yaz</h3><p className="text-xs text-slate-500 mt-1">Dava, şikayet ve istifa dilekçesi.</p>
                            </button>
                            <button onClick={() => { setMode('reply'); setStep(2); }} className="p-6 bg-orange-50 border-2 border-orange-100 hover:border-orange-500 hover:bg-white rounded-2xl text-left transition-all hover:shadow-lg group">
                                <div className="size-12 bg-white text-orange-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><ShieldCheck className="w-6 h-6" /></div><h3 className="text-lg font-bold text-slate-800">Cevap Ver</h3><p className="text-xs text-slate-500 mt-1">Gelen davaya hukuki savunma.</p>
                            </button>
                        </div>
                        <div className="mt-12 border-t border-slate-100 pt-8 text-slate-500 text-sm leading-relaxed space-y-6">
                            <div><h2 className="text-base font-bold text-slate-800 mb-2">Dilekçe Nasıl Yazılır?</h2><p>Profesyonel bir dilekçe yazmak için HMK kurallarına uymak gerekir. <strong>Dilekçe Asistanım</strong>, yapay zeka destekli altyapısı ile saniyeler içinde mahkeme standartlarına uygun belgeler oluşturur.</p></div>
                            <div className="space-y-4">{FAQ_DATA.map((item, idx) => (<details key={idx} className="group border border-slate-200 rounded-xl bg-slate-50"><summary className="flex items-center justify-between p-4 font-bold text-sm cursor-pointer text-slate-700">{item.q}<ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180"/></summary><div className="px-4 pb-4 text-sm text-slate-600">{item.a}</div></details>))}</div>
                        </div>
                    </div>
                )}
                {/* Diğer adımlar (Kategori, Bilgi Girişi, Sonuç) aynen devam ediyor... */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> Geri</button><h2 className="text-2xl font-bold">Konu Seçimi</h2>
                        <div className="grid gap-3">{CATEGORIES.map((cat) => (<button key={cat.id} onClick={() => { setCategory(cat); setStep(3); }} className="flex items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-primary hover:bg-slate-50 transition-all text-left group"><div className="bg-slate-100 p-2 rounded-lg text-slate-600 group-hover:bg-white group-hover:text-primary transition-colors">{cat.icon}</div><div className="ml-4"><h4 className="font-bold text-slate-900">{cat.label}</h4><p className="text-xs text-slate-500">{cat.desc}</p></div><ArrowRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-primary" /></button>))}</div>
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-4">
                        <button onClick={() => setStep(2)} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1"><ArrowLeft className="w-4 h-4"/> Geri</button>
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-center gap-2 text-sm font-bold text-blue-900">{mode === 'create' ? 'TALEP' : 'SAVUNMA'} - {category.label}</div>
                        <div className="grid grid-cols-2 gap-4"><div><label className="input-label">Ad Soyad</label><input name="name" className="input-field" value={formData.name} onChange={handleChange} placeholder="Adınız" /></div><div><label className="input-label">TC Kimlik</label><input name="tc" className="input-field" value={formData.tc} onChange={handleChange} placeholder="11 Haneli" /></div></div>
                        <div><label className="input-label">Adres</label><input name="address" className="input-field" value={formData.address} onChange={handleChange} placeholder="Tebligat Adresi" /></div>
                        <div><label className="input-label">Karşı Taraf</label><input name="defendant" className="input-field" value={formData.defendant} onChange={handleChange} placeholder="Kişi veya Kurum Adı" /></div>
                        {mode === 'reply' && (<div className="border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-center cursor-pointer" onClick={() => fileInputRef.current?.click()}><input type="file" ref={fileInputRef} className="hidden" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} /><div className="size-10 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-2 text-primary"><UploadCloud className="w-5 h-5" /></div><p className="font-bold text-slate-700 text-sm">Dosya Yükle</p>{formData.fileName && <div className="mt-2 text-xs font-bold text-green-700">{formData.fileName}</div>}</div>)}
                        <div><label className="input-label">Detaylar</label><textarea name="story" className="w-full h-32 p-3 rounded-xl border border-slate-300 focus:border-primary outline-none resize-none text-sm" placeholder="Olayı anlatın..." value={formData.story} onChange={handleChange} /></div>
                    </div>
                )}
                {step === 4 && (
                    <div className="lg:hidden text-center py-10 animate-in zoom-in duration-300">
                        <div className="size-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8"/></div><h2 className="text-2xl font-bold mb-6">Hazır!</h2>
                        <button onClick={downloadAsWord} className="w-full py-3 bg-primary text-white rounded-xl font-bold mb-3 flex items-center justify-center gap-2"><FileDown className="w-5 h-5"/> Word İndir</button>
                        <button onClick={() => window.print()} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold mb-3">PDF / Yazdır</button><button onClick={() => setStep(3)} className="text-slate-500 font-medium text-sm">Geri Dön</button>
                    </div>
                )}
            </div>
            {step === 3 && (<div className="p-4 bg-white border-t border-slate-200 z-20 shrink-0 shadow-lg"><button onClick={handleGenerate} disabled={loading} className="w-full h-12 bg-primary text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70">{loading ? "Oluşturuluyor..." : "Dilekçeyi Oluştur"}</button></div>)}
            
            {/* FOOTER (Yasal Linkler) */}
            <div className="bg-slate-50 p-4 text-center border-t border-slate-200 text-[10px] text-slate-400">
                <div className="flex justify-center gap-4 mb-2">
                    <a href="/gizlilik" target="_blank" className="hover:text-primary transition-colors flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Gizlilik Politikası</a>
                    <span className="text-slate-300">|</span>
                    <a href="/sartlar" target="_blank" className="hover:text-primary transition-colors flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Kullanım Şartları</a>
                </div>
                <p>&copy; 2026 Dilekçe Asistanım. Tüm hakları saklıdır.</p>
            </div>
        </section>

        <aside className={`${step === 4 ? 'flex' : 'hidden lg:flex'} flex-1 bg-slate-100 flex-col items-center py-10 overflow-y-auto custom-scrollbar relative border-l border-slate-200`}>
            {step === 4 && (<div className="sticky top-0 z-30 mb-6 flex gap-3 bg-white/50 p-2 rounded-xl backdrop-blur-sm shadow-sm print:hidden"><button onClick={() => setStep(3)} className="px-4 py-2 bg-white text-slate-700 rounded-lg shadow-sm border border-slate-200 font-bold text-sm">Geri</button><button onClick={downloadAsWord} className="px-4 py-2 bg-primary text-white rounded-lg shadow-md hover:bg-blue-700 font-bold text-sm flex items-center gap-2"><FileDown className="w-4 h-4"/> Word İndir</button><button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 text-white rounded-lg shadow-md hover:bg-slate-700 font-bold text-sm flex items-center gap-2"><Printer className="w-4 h-4"/> Yazdır</button></div>)}
            <div id="print-area" className={`pdf-page transition-all duration-500 bg-white shadow-2xl p-[2.5cm] w-[21cm] min-h-[29.7cm] text-black font-serif text-[12pt] leading-relaxed ${step < 4 ? 'opacity-50 blur-sm scale-95' : 'opacity-100 blur-none scale-100'}`}>
                {step === 4 ? (
                    <>
                        <div className="text-center font-bold mb-10 border-b-2 border-black pb-4 uppercase"><input name="institution" value={formData.institution} onChange={handlePaperChange} className="paper-input text-center font-bold uppercase w-full text-[12pt]" /></div>
                        <table className="w-full mb-8 text-sm"><tbody><tr><td className="font-bold w-32 pb-2 align-top">{mode === 'reply' ? 'DAVALI' : 'DAVACI'}</td><td className="w-4 align-top">:</td><td className="pb-2"><input name="name" value={formData.name} onChange={handlePaperChange} className="paper-input uppercase font-bold" /></td></tr><tr><td className="font-bold pb-2 align-top">TC KİMLİK</td><td className="align-top">:</td><td className="pb-2"><input name="tc" value={formData.tc} onChange={handlePaperChange} className="paper-input" /></td></tr><tr><td className="font-bold pb-2 align-top">ADRES</td><td className="align-top">:</td><td className="pb-2"><input name="address" value={formData.address} onChange={handlePaperChange} className="paper-input" /></td></tr><tr><td className="font-bold pb-2 align-top">{mode === 'reply' ? 'DAVACI' : 'DAVALI'}</td><td className="align-top">:</td><td className="pb-2"><input name="defendant" value={formData.defendant} onChange={handlePaperChange} className="paper-input uppercase" /></td></tr><tr><td className="font-bold pb-2 align-top">KONU</td><td className="align-top">:</td><td className="pb-2"><input name="subject" value={formData.subject} onChange={handlePaperChange} className="paper-input font-bold" /></td></tr></tbody></table>
                        <div className="font-bold underline mb-4">AÇIKLAMALAR :</div><textarea ref={bodyRef} name="body" value={formData.body} onChange={handlePaperChange} className="paper-textarea text-justify indent-8 mb-8 leading-relaxed font-serif text-[12pt] min-h-[300px]" /><div className="font-bold underline mb-4">SONUÇ VE İSTEM :</div><textarea ref={resultRef} name="result" value={formData.result} onChange={handlePaperChange} className="paper-textarea text-justify leading-relaxed font-serif text-[12pt] min-h-[100px]" /><div className="flex justify-end mt-20 text-center w-40 ml-auto"><div><div className="mb-4">.../.../2026</div><div className="font-bold uppercase mb-8">{formData.name}</div><div className="border-t border-black pt-1 text-xs">İmza</div></div></div>
                    </>
                ) : (<div className="flex flex-col items-center justify-center h-full text-slate-300 select-none"><Gavel className="w-24 h-24 mb-4 opacity-20"/><p className="font-bold text-xl uppercase tracking-widest text-slate-300">Önizleme Bekleniyor</p></div>)}
            </div>
        </aside>
      </main>
    </div>
  )
}