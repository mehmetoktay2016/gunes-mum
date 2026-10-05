import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import { stokBildirimiDogrula, stokBildirimiGonder } from '../siparis.js'

// Tükenen ürün için "gelince haber ver" penceresi: ad ve e-posta alır, webhook'a iletir.
function StockAlertDialog({ urun, uye, onKapat }) {
  const acik = urun !== null
  const [ad, setAd] = useState('')
  const [eposta, setEposta] = useState('')
  const [hata, setHata] = useState('')
  const [bekliyor, setBekliyor] = useState(false)
  const [gonderildi, setGonderildi] = useState(false)

  useEffect(() => {
    if (!acik) return
    setAd(uye?.ad ?? '')
    setEposta(uye?.eposta ?? '')
    setHata('')
    setGonderildi(false)
  }, [acik, urun, uye])

  async function gonder(e) {
    e.preventDefault()
    const sorun = stokBildirimiDogrula({ ad, eposta })
    if (sorun) {
      setHata(sorun)
      return
    }
    setBekliyor(true)
    try {
      await stokBildirimiGonder({ ad, eposta, urun })
      setHata('')
      setGonderildi(true)
    } catch {
      setHata('Talebiniz gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin.')
    } finally {
      setBekliyor(false)
    }
  }

  return (
    <Modal acik={acik} onKapat={onKapat} baslikId="stok-baslik">
      {acik && gonderildi && (
        <div className="form" role="status">
          <h2 id="stok-baslik">Talebiniz alındı</h2>
          <p className="giris-not">
            {urun.ad} yeniden stoğa girdiğinde {eposta.trim()} adresine e-posta göndereceğiz.
          </p>
          <div className="giris-butonlar">
            <button type="button" className="sepet-buton" onClick={onKapat}>
              Tamam
            </button>
          </div>
        </div>
      )}

      {acik && !gonderildi && (
        <form className="form" onSubmit={gonder} noValidate>
          <h2 id="stok-baslik">Gelince haber verelim</h2>
          <p className="giris-not">
            {urun.ad} şu an tükendi. Adınızı ve e-postanızı bırakın, yeniden stoğa girince size yazalım.
          </p>

          <label htmlFor="stok-ad">Adınız</label>
          <input id="stok-ad" type="text" autoComplete="name" value={ad} onChange={(e) => setAd(e.target.value)} />

          <label htmlFor="stok-eposta">E-posta</label>
          <input
            id="stok-eposta"
            type="email"
            autoComplete="email"
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
          />

          {hata && <p className="giris-hata" role="alert">{hata}</p>}

          <div className="giris-butonlar">
            <button type="button" className="ikincil-buton" onClick={onKapat}>
              Vazgeç
            </button>
            <button type="submit" className="sepet-buton" disabled={bekliyor}>
              Haber ver
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}

export default StockAlertDialog
