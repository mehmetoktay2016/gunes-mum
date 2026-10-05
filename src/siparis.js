// Sipariş ve stok bildirimi işlemleri: doğrulama ve webhook ile gönderim.
import { webhookGonderBekle } from './webhook.js'
import { epostaGecerliMi } from './uyelik.js'

// Boşluk, tire ve parantezler atılır; 0, +90 ya da öneksiz 10 haneli Türkiye numarası kabul edilir.
export function telefonDuzenle(telefon) {
  return telefon.replace(/[\s\-()]/g, '')
}

export function telefonGecerliMi(telefon) {
  return /^(?:\+90|0)?[2-5]\d{9}$/.test(telefonDuzenle(telefon))
}

function siparisNoUret() {
  const tarih = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const sira = String(crypto.getRandomValues(new Uint16Array(1))[0] % 10000).padStart(4, '0')
  return `GM-${tarih}-${sira}`
}

export function siparisDogrula({ ad, urunId, telefon }) {
  if (ad.trim().length < 2) return 'Adınızı yazın (en az 2 karakter).'
  if (!urunId) return 'Sipariş vermek istediğiniz ürünü seçin.'
  if (!telefonGecerliMi(telefon)) return 'Geçerli bir telefon numarası yazın, ör. 0555 123 45 67.'
  return ''
}

// Siparişi gönderir; başarılı olursa sipariş numarasını döner.
export async function siparisGonder({ ad, urun, telefon }) {
  const siparisNo = siparisNoUret()
  await webhookGonderBekle('siparis.olusturuldu', {
    siparisNo,
    ad: ad.trim(),
    telefon: telefonDuzenle(telefon),
    urunler: [{ id: urun.id, ad: urun.ad, adet: 1, birimFiyat: urun.fiyat, araToplam: urun.fiyat }],
    toplamAdet: 1,
    toplamTutar: urun.fiyat,
    paraBirimi: 'TRY',
  })
  return siparisNo
}

export function stokBildirimiDogrula({ ad, eposta }) {
  if (ad.trim().length < 2) return 'Adınızı yazın (en az 2 karakter).'
  if (!epostaGecerliMi(eposta)) return 'Geçerli bir e-posta adresi yazın.'
  return ''
}

export async function stokBildirimiGonder({ ad, eposta, urun }) {
  await webhookGonderBekle('stok.bildirim_istendi', {
    ad: ad.trim(),
    eposta: eposta.trim().toLowerCase(),
    urun: { id: urun.id, ad: urun.ad },
  })
}
