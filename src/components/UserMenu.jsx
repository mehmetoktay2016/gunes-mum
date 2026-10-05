// Başlıktaki üye alanı: giriş yapılmamışsa "Giriş yap", yapılmışsa selamlama ve çıkış.
// Üye olma, giriş penceresindeki "Üye olun" bağlantısından açılır.
function UserMenu({ uye, onGirisAc, onCikis }) {
  if (!uye) {
    return (
      <button type="button" className="ikincil-buton" onClick={onGirisAc}>
        Giriş yap
      </button>
    )
  }

  const ilkAd = uye.ad.split(' ')[0]

  return (
    <div className="uye-menu">
      <span className="uye-selam">Merhaba, {ilkAd}</span>
      <button type="button" className="metin-buton" onClick={onCikis}>
        Çıkış yap
      </button>
    </div>
  )
}

export default UserMenu
