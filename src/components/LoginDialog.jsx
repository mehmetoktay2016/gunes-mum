import { useEffect, useState } from 'react'
import Modal from './Modal.jsx'
import { girisKontrol } from '../uyelik.js'

// Üye girişi penceresi. Demo hesap ve "Üye ol" ile kaydolan üyeler giriş yapabilir.
function LoginDialog({ acik, demoUye, onGiris, onKapat, onKayitAc }) {
  const [eposta, setEposta] = useState(demoUye.eposta)
  const [sifre, setSifre] = useState(demoUye.sifre)
  const [hata, setHata] = useState('')
  const [bekliyor, setBekliyor] = useState(false)

  useEffect(() => {
    if (acik) setHata('')
  }, [acik])

  async function gonder(e) {
    e.preventDefault()
    if (!eposta.trim() || !sifre) {
      setHata('E-posta ve şifre alanlarını doldurun.')
      return
    }
    setBekliyor(true)
    try {
      const uye = await girisKontrol(eposta, sifre)
      if (!uye) {
        setHata('E-posta veya şifre hatalı.')
        return
      }
      setHata('')
      onGiris(uye)
    } catch (hataNesnesi) {
      setHata(hataNesnesi.message)
    } finally {
      setBekliyor(false)
    }
  }

  return (
    <Modal acik={acik} onKapat={onKapat} baslikId="giris-baslik">
      <form className="form" onSubmit={gonder} noValidate>
        <h2 id="giris-baslik">Üye girişi</h2>

        <label htmlFor="giris-eposta">E-posta</label>
        <input
          id="giris-eposta"
          type="email"
          autoComplete="username"
          value={eposta}
          onChange={(e) => setEposta(e.target.value)}
        />

        <label htmlFor="giris-sifre">Şifre</label>
        <input
          id="giris-sifre"
          type="password"
          autoComplete="current-password"
          value={sifre}
          onChange={(e) => setSifre(e.target.value)}
        />

        {hata && <p className="giris-hata" role="alert">{hata}</p>}

        <p className="giris-not">
          Demo hesap: {demoUye.eposta} / {demoUye.sifre}
        </p>

        <div className="giris-butonlar">
          <button type="button" className="ikincil-buton" onClick={onKapat}>
            Vazgeç
          </button>
          <button type="submit" className="sepet-buton" disabled={bekliyor}>
            Giriş yap
          </button>
        </div>

        <p className="pencere-gecis">
          Hesabınız yok mu?{' '}
          <button type="button" className="metin-buton" onClick={onKayitAc}>
            Üye olun
          </button>
        </p>
      </form>
    </Modal>
  )
}

export default LoginDialog
