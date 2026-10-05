import { useState } from 'react'

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
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHata(true)}
    />
  )
}

export default ProductImage
