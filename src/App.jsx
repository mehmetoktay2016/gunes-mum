import { useEffect, useState } from 'react'
import CartSummary from './components/CartSummary.jsx'
import ContactInfo from './components/ContactInfo.jsx'
import LoginDialog from './components/LoginDialog.jsx'
import OrderForm from './components/OrderForm.jsx'
import ProductList from './components/ProductList.jsx'
import RegisterDialog from './components/RegisterDialog.jsx'
import StockAlertDialog from './components/StockAlertDialog.jsx'
import UserMenu from './components/UserMenu.jsx'
import { demoUye, iletisim, siteAdresi } from './atolye.js'
import urunler from './urunler.js'

// Satıştaki (stokta olan) ürünler: sepete eklenebilir ve sipariş verilebilir.
const satistakiUrunler = urunler.filter((urun) => urun.stok > 0)

const SEPET_ANAHTARI = 'gunes-mum-sepet'
const UYE_ANAHTARI = 'gunes-mum-uye'

// Tarayıcıdan bir nesne okur. Kayıt yoksa ya da bozuksa `null` döner.
function nesneOku(anahtar) {
  try {
    const kayit = JSON.parse(localStorage.getItem(anahtar))
    return kayit && typeof kayit === 'object' && !Array.isArray(kayit) ? kayit : null
  } catch {
    return null
  }
}

function kaydet(anahtar, deger) {
  try {
    if (deger === null) localStorage.removeItem(anahtar)
    else localStorage.setItem(anahtar, JSON.stringify(deger))
  } catch {
    // Kaydedilemezse bilgi yalnızca bu oturumda kalır.
  }
}

function App() {
  // Sepet: ürün id'sinden adede giden nesne, ör. { 1: 2, 3: 1 }
  const [sepet, setSepet] = useState(() => nesneOku(SEPET_ANAHTARI) ?? {})
  // Giriş yapmış üye: { ad, eposta } ya da null
  const [uye, setUye] = useState(() => nesneOku(UYE_ANAHTARI))
  // Açık pencere: null, 'giris' ya da 'kayit'
  const [pencere, setPencere] = useState(null)
  // Stok bildirimi penceresinin açık olduğu ürün ya da null
  const [stokUrunu, setStokUrunu] = useState(null)

  useEffect(() => kaydet(SEPET_ANAHTARI, sepet), [sepet])
  useEffect(() => kaydet(UYE_ANAHTARI, uye), [uye])

  function sepeteEkle(id) {
    if (!satistakiUrunler.some((urun) => urun.id === id)) return
    setSepet((onceki) => ({ ...onceki, [id]: (onceki[id] ?? 0) + 1 }))
  }

  function sepettenAzalt(id) {
    setSepet((onceki) => {
      const yeni = { ...onceki }
      if (yeni[id] > 1) {
        yeni[id] -= 1
      } else {
        delete yeni[id]
      }
      return yeni
    })
  }

  function girisYap(girenUye) {
    setUye(girenUye)
    setPencere(null)
  }

  // Toplamlar satıştaki ürünler üzerinden hesaplanır; tükenen ya da katalogda olmayan eski kayıtlar sayılmaz.
  const toplamAdet = satistakiUrunler.reduce((toplam, urun) => toplam + (sepet[urun.id] ?? 0), 0)
  const toplamTutar = satistakiUrunler.reduce(
    (toplam, urun) => toplam + urun.fiyat * (sepet[urun.id] ?? 0),
    0
  )

  return (
    <>
      <header>
        <div className="ust-cubuk">
          <UserMenu
            uye={uye}
            onGirisAc={() => setPencere('giris')}
            onCikis={() => setUye(null)}
          />
          <CartSummary adet={toplamAdet} tutar={toplamTutar} />
        </div>
        <h1>Güneş Mum</h1>
        <p>Elde dökülen doğal mumlar</p>
      </header>

      <main>
        <ProductList
          urunler={urunler}
          sepet={sepet}
          onEkle={sepeteEkle}
          onAzalt={sepettenAzalt}
          onStokBildirimi={setStokUrunu}
        />
        <OrderForm
          urunler={satistakiUrunler}
          atolyeTelefonu={iletisim.telefon}
          varsayilanAd={uye?.ad}
        />
        <ContactInfo iletisim={iletisim} siteAdresi={siteAdresi} />
      </main>

      <footer>© 2026 Güneş Mum Atölyesi</footer>

      <LoginDialog
        acik={pencere === 'giris'}
        demoUye={demoUye}
        onGiris={girisYap}
        onKapat={() => setPencere(null)}
        onKayitAc={() => setPencere('kayit')}
      />
      <RegisterDialog
        acik={pencere === 'kayit'}
        onKayit={girisYap}
        onKapat={() => setPencere(null)}
        onGirisAc={() => setPencere('giris')}
      />
      <StockAlertDialog urun={stokUrunu} uye={uye} onKapat={() => setStokUrunu(null)} />
    </>
  )
}

export default App
