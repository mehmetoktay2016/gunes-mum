import { useState } from 'react'
import { siparisDogrula, siparisGonder } from '../siparis.js'

// "Sipariş verin" bölümü: ad, ürün ve telefon alır; gönderince onay gösterir ve webhook'a iletir.
function OrderForm({ urunler, atolyeTelefonu, varsayilanAd }) {
  const bosForm = { ad: varsayilanAd ?? '', urunId: '', telefon: '' }
  const [form, setForm] = useState(bosForm)
  const [hata, setHata] = useState('')
  const [bekliyor, setBekliyor] = useState(false)
  const [onay, setOnay] = useState(null)

  const alan = (ad) => ({
    value: form[ad],
    onChange: (e) => setForm({ ...form, [ad]: e.target.value }),
  })

  async function gonder(e) {
    e.preventDefault()
    const sorun = siparisDogrula(form)
    if (sorun) {
      setHata(sorun)
      return
    }
    const urun = urunler.find((u) => String(u.id) === form.urunId)
    setBekliyor(true)
    try {
      const siparisNo = await siparisGonder({ ad: form.ad, urun, telefon: form.telefon })
      setHata('')
      setOnay({ siparisNo, urunAd: urun.ad, telefon: form.telefon.trim() })
      setForm(bosForm)
    } catch {
      setHata(`Sipariş gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin ya da ${atolyeTelefonu} numarasından bizi arayın.`)
    } finally {
      setBekliyor(false)
    }
  }

  return (
    <section className="siparis" aria-labelledby="siparis-baslik">
      <h2 id="siparis-baslik" className="bolum-baslik">Sipariş verin</h2>

      {onay ? (
        <div className="siparis-onay" role="status">
          <h3>Siparişiniz alındı</h3>
          <p>
            {onay.urunAd} için siparişiniz bize ulaştı. Sizi {onay.telefon} numarasından arayıp
            teslimatı birlikte planlayacağız.
          </p>
          <p className="siparis-no">Sipariş numarası: {onay.siparisNo}</p>
          <button type="button" className="ikincil-buton" onClick={() => setOnay(null)}>
            Yeni sipariş ver
          </button>
        </div>
      ) : (
        <form className="form siparis-form" onSubmit={gonder} noValidate>
          <p className="siparis-aciklama">
            Formu doldurun, sizi arayıp siparişinizi onaylayalım.
          </p>

          <label htmlFor="siparis-ad">Adınız</label>
          <input id="siparis-ad" type="text" autoComplete="name" {...alan('ad')} />

          <label htmlFor="siparis-urun">Ürün</label>
          <select id="siparis-urun" {...alan('urunId')}>
            <option value="">Ürün seçin</option>
            {urunler.map((urun) => (
              <option key={urun.id} value={urun.id}>
                {urun.ad} ({urun.fiyat.toLocaleString('tr-TR')} TL)
              </option>
            ))}
          </select>

          <label htmlFor="siparis-telefon">Telefon</label>
          <input
            id="siparis-telefon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0555 123 45 67"
            {...alan('telefon')}
          />

          {hata && <p className="giris-hata" role="alert">{hata}</p>}

          <div className="giris-butonlar">
            <button type="submit" className="sepet-buton" disabled={bekliyor}>
              Sipariş ver
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

export default OrderForm
