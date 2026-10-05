// Başlıktaki sepet göstergesi: toplam adet ve tutar.
function CartSummary({ adet, tutar }) {
  return (
    <div className="sepet-ozeti" aria-live="polite">
      {adet === 0 ? (
        <span className="sepet-ozeti-bos">Sepetiniz boş</span>
      ) : (
        <>
          <span className="sepet-ozeti-adet">Sepet: {adet} ürün</span>
          <span className="sepet-ozeti-tutar">{tutar.toLocaleString('tr-TR')} TL</span>
        </>
      )}
    </div>
  )
}

export default CartSummary
