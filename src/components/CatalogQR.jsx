import { QRCodeSVG } from 'qrcode.react'

// Katalog adresinin QR kodu: telefon kamerasıyla okutulunca site açılır.
function CatalogQR({ adres }) {
  return (
    <figure className="katalog-qr">
      <div className="katalog-qr-kutu">
        {/* marginSize 4: QR standardının istediği boşluk; okunabilirlik için gerekli */}
        <QRCodeSVG
          value={adres}
          size={176}
          level="M"
          marginSize={4}
          fgColor="currentColor"
          bgColor="transparent"
          title="Güneş Mum kataloğunu açan QR kod"
        />
      </div>
      <figcaption>
        Telefonunuzun kamerasıyla okutun, katalog açılsın.
        <br />
        <a href={adres}>{adres.replace(/^https:\/\//, '').replace(/\/$/, '')}</a>
      </figcaption>
    </figure>
  )
}

export default CatalogQR
