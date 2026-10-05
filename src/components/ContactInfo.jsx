import CatalogQR from './CatalogQR.jsx'

// İletişim bölümü: adres, telefon, e-posta, Instagram, çalışma saatleri ve katalog QR kodu.
function ContactInfo({ iletisim, siteAdresi }) {
  const telefonLinki = 'tel:' + iletisim.telefon.replace(/\s/g, '')

  return (
    <section className="iletisim" aria-labelledby="iletisim-baslik">
      <h2 id="iletisim-baslik" className="iletisim-baslik">Bize ulaşın</h2>

      <div className="iletisim-izgara">
        <address className="iletisim-blok">
          <h3>Atölye</h3>
          <p>{iletisim.adres}</p>
          <p><a href={telefonLinki}>{iletisim.telefon}</a></p>
          <p><a href={`mailto:${iletisim.eposta}`}>{iletisim.eposta}</a></p>
          <p>Instagram: {iletisim.instagram}</p>
        </address>

        <div className="iletisim-blok">
          <h3>Çalışma saatleri</h3>
          <dl className="saatler">
            {iletisim.calismaSaatleri.map((satir) => (
              <div key={satir.gunler} className="saatler-satir">
                <dt>{satir.gunler}</dt>
                <dd>{satir.saat}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="iletisim-blok">
          <h3>Kataloğu telefonda açın</h3>
          <CatalogQR adres={siteAdresi} />
        </div>
      </div>
    </section>
  )
}

export default ContactInfo
