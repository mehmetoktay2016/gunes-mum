// Üyelik işlemleri (DEMO). Sunucu yok; üyeler tarayıcının localStorage'ında tutulur.
// Şifreler düz metin değil, tuzlanmış SHA-256 özeti olarak saklanır.
import { demoUye } from './atolye.js'

const UYELER_ANAHTARI = 'gunes-mum-uyeler'

export function epostaGecerliMi(eposta) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta.trim())
}

const duzenle = (eposta) => eposta.trim().toLowerCase()

function uyeleriOku() {
  try {
    const liste = JSON.parse(localStorage.getItem(UYELER_ANAHTARI))
    return Array.isArray(liste) ? liste : []
  } catch {
    return []
  }
}

async function ozetle(tuz, sifre) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Bu tarayıcı şifre işlemeyi desteklemiyor.')
  }
  const veri = new TextEncoder().encode(tuz + sifre)
  const ozet = await crypto.subtle.digest('SHA-256', veri)
  return [...new Uint8Array(ozet)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function rastgeleTuz() {
  return [...crypto.getRandomValues(new Uint8Array(16))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function kayitliMi(eposta) {
  const e = duzenle(eposta)
  return e === demoUye.eposta || uyeleriOku().some((uye) => uye.eposta === e)
}

// Yeni üyeyi kaydeder ve giriş yapmış üye bilgisini ({ ad, eposta }) döner.
export async function uyeKaydet({ ad, eposta, sifre }) {
  const tuz = rastgeleTuz()
  const yeni = {
    ad: ad.trim(),
    eposta: duzenle(eposta),
    tuz,
    sifreOzeti: await ozetle(tuz, sifre),
  }
  localStorage.setItem(UYELER_ANAHTARI, JSON.stringify([...uyeleriOku(), yeni]))
  return { ad: yeni.ad, eposta: yeni.eposta }
}

// Bilgiler doğruysa { ad, eposta }, değilse null döner. Demo hesap da kabul edilir.
export async function girisKontrol(eposta, sifre) {
  const e = duzenle(eposta)
  if (e === demoUye.eposta) {
    return sifre === demoUye.sifre ? { ad: demoUye.ad, eposta: e } : null
  }
  const uye = uyeleriOku().find((u) => u.eposta === e)
  if (!uye) return null
  return (await ozetle(uye.tuz, sifre)) === uye.sifreOzeti ? { ad: uye.ad, eposta: uye.eposta } : null
}

// "Örnek bilgilerle doldur" için rastgele, uydurma bir üye üretir.
const ADLAR = ['Elif', 'Can', 'Zeynep', 'Mert', 'Selin', 'Emre', 'Ayşe', 'Burak', 'Defne', 'Kerem', 'Ece', 'Onur']
const SOYADLAR = ['Yıldız', 'Kaya', 'Şahin', 'Çelik', 'Öztürk', 'Aydın', 'Güneş', 'Koç', 'Arslan', 'Doğan']
const TR_HARF = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a' }

const sec = (liste) => liste[Math.floor(Math.random() * liste.length)]
const asciiYap = (metin) => metin.toLocaleLowerCase('tr').replace(/[çğıöşüâ]/g, (h) => TR_HARF[h])

export function rastgeleUye() {
  const ad = sec(ADLAR)
  const soyad = sec(SOYADLAR)
  const sayi = Math.floor(10 + Math.random() * 90)
  const harfler = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const sifre =
    Array.from({ length: 8 }, () => sec([...harfler])).join('') + sec(['!', '?', '#', '*']) + sayi
  return {
    ad: `${ad} ${soyad}`,
    eposta: `${asciiYap(ad)}.${asciiYap(soyad)}${sayi}@example.com`,
    sifre,
  }
}
