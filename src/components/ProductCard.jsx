import ProductImage from './ProductImage.jsx'

// Tek bir ürünün kartı: kemerli görsel, ad, açıklama, fiyat ve sepet kontrolü.
// Sepet bilgisi App'te tutulur; kart sadece adedi gösterir ve değişikliği bildirir.
function ProductCard({ urun, adet, onEkle, onAzalt }) {
  return (
    <article className="urun">
      <div className="urun-cerceve">
        <ProductImage src={urun.gorsel} alt={urun.ad} />
      </div>

      <h2 className="urun-ad">{urun.ad}</h2>
      <p className="urun-aciklama">{urun.aciklama}</p>

      <div className="urun-alt">
        <p className="fiyat">
          {urun.fiyat.toLocaleString('tr-TR')}
          <span className="fiyat-birim"> TL</span>
        </p>

        {adet === 0 ? (
          <button type="button" className="sepet-buton" onClick={onEkle}>
            Sepete ekle
          </button>
        ) : (
          <div className="adet-secici" role="group" aria-label={`${urun.ad} sepetteki adet`}>
            <button type="button" onClick={onAzalt} aria-label={`${urun.ad} adedini azalt`}>
              −
            </button>
            <span className="adet-secici-sayi">{adet}</span>
            <button type="button" onClick={onEkle} aria-label={`${urun.ad} adedini artır`}>
              +
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default ProductCard
