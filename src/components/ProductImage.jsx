import { useState } from 'react'

// "/gorseller/x.png" gibi kökten başlayan yolları sitenin yayın adresine (BASE_URL) göre çözer.
const adresCoz = (yol) => (yol.startsWith('/') ? import.meta.env.BASE_URL + yol.slice(1) : yol)

// Ürün görselini gösterir. Görsel yoksa ya da yüklenemezse mum ikonu gösterir.
function ProductImage({ src, alt }) {
  const [hata, setHata] = useState(false)

  if (!src || hata) {
    return (
      <div className="urun-gorsel urun-gorsel--bos" role="img" aria-label={alt}>
        🕯️
      </div>
    )
  }

  return (
    <img
      className="urun-gorsel"
      src={adresCoz(src)}
      alt={alt}
      loading="lazy"
      onError={() => setHata(true)}
    />
  )
}

export default ProductImage
