import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import { epostaGecerliMi, kayitliMi, rastgeleUye, uyeKaydet } from '../uyelik.js'

const BOS_FORM = { ad: '', eposta: '', sifre: '', sifreTekrar: '' }

// Formdaki ilk hatayı döner; hata yoksa boş metin.
function dogrula(form) {
  if (form.ad.trim().length < 2) return 'Ad soyad en az 2 karakter olmalı.'
  if (!epostaGecerliMi(form.eposta)) return 'Geçerli bir e-posta adresi girin.'
  if (kayitliMi(form.eposta)) return 'Bu e-posta ile zaten bir üyelik var. Giriş yapmayı deneyin.'
  if (form.sifre.length < 8) return 'Şifre en az 8 karakter olmalı.'
  if (form.sifre !== form.sifreTekrar) return 'Şifreler birbiriyle aynı değil.'
  return ''
}

// Üye olma penceresi. Kayıt başarılı olursa üye otomatik olarak giriş yapar.
function RegisterDialog({ acik, onKayit, onKapat, onGirisAc }) {
  const [form, setForm] = useState(BOS_FORM)
  const [hata, setHata] = useState('')
  const [bekliyor, setBekliyor] = useState(false)

  useEffect(() => {
    if (acik) setHata('')
  }, [acik])

  const alan = (ad) => ({
    value: form[ad],
    onChange: (e) => setForm({ ...form, [ad]: e.target.value }),
  })

  function ornekDoldur() {
    const uye = rastgeleUye()
    setForm({ ad: uye.ad, eposta: uye.eposta, sifre: uye.sifre, sifreTekrar: uye.sifre })
    setHata('')
  }

  async function gonder(e) {
    e.preventDefault()
    const sorun = dogrula(form)
    if (sorun) {
      setHata(sorun)
      return
    }
    setBekliyor(true)
    try {
      const uye = await uyeKaydet(form)
      setForm(BOS_FORM)
      onKayit(uye)
    } catch (hataNesnesi) {
      setHata(hataNesnesi.message || 'Kayıt tamamlanamadı. Tekrar deneyin.')
    } finally {
      setBekliyor(false)
    }
  }

  return (
    <Modal acik={acik} onKapat={onKapat} baslikId="kayit-baslik">
      <form className="form" onSubmit={gonder} noValidate>
        <h2 id="kayit-baslik">Üye ol</h2>

        <label htmlFor="kayit-ad">Ad soyad</label>
        <input id="kayit-ad" type="text" autoComplete="name" {...alan('ad')} />

        <label htmlFor="kayit-eposta">E-posta</label>
        <input id="kayit-eposta" type="email" autoComplete="email" {...alan('eposta')} />

        <label htmlFor="kayit-sifre">Şifre</label>
        <input
          id="kayit-sifre"
          type="password"
          autoComplete="new-password"
          aria-describedby="kayit-sifre-ipucu"
          {...alan('sifre')}
        />
        <p id="kayit-sifre-ipucu" className="alan-ipucu">En az 8 karakter.</p>

        <label htmlFor="kayit-sifre-tekrar">Şifre (tekrar)</label>
        <input id="kayit-sifre-tekrar" type="password" autoComplete="new-password" {...alan('sifreTekrar')} />

        {hata && <p className="giris-hata" role="alert">{hata}</p>}

        <p className="giris-not">
          <button type="button" className="metin-buton" onClick={ornekDoldur}>
            Örnek bilgilerle doldur
          </button>
        </p>

        <div className="giris-butonlar">
          <button type="button" className="ikincil-buton" onClick={onKapat}>
            Vazgeç
          </button>
          <button type="submit" className="sepet-buton" disabled={bekliyor}>
            Üye ol
          </button>
        </div>

        <p className="pencere-gecis">
          Zaten üye misiniz?{' '}
          <button type="button" className="metin-buton" onClick={onGirisAc}>
            Giriş yapın
          </button>
        </p>
      </form>
    </Modal>
  )
}

export default RegisterDialog
