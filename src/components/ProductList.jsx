import ProductCard from './ProductCard.jsx'

// Katalog: ürün listesini alır, her ürün için bir ProductCard çizer.
function ProductList({ urunler, sepet, onEkle, onAzalt, onStokBildirimi }) {
  if (urunler.length === 0) {
    return <p className="bos-katalog">Şu an katalogda ürün bulunmuyor.</p>
  }

  return (
    <section className="katalog" aria-label="Ürün kataloğu">
      {urunler.map((urun) => (
        <ProductCard
          key={urun.id}
          urun={urun}
          adet={sepet[urun.id] ?? 0}
          onEkle={() => onEkle(urun.id)}
          onAzalt={() => onAzalt(urun.id)}
          onStokBildirimi={() => onStokBildirimi(urun)}
        />
      ))}
    </section>
  )
}

export default ProductList
