// Olayları standart zarf içinde webhook adresine gönderir (.claude/skills/atolyekart/webhook.md).
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL

export const webhookAyarliMi = () => Boolean(WEBHOOK_URL)

// Gönderir ve sonucu bekler. Adres yoksa ya da alıcı hata dönerse Error fırlatır.
// Formlar bunu `await` ile kullanır; arka plan olayları için webhookGonder kullanılır.
export async function webhookGonderBekle(olay, veri) {
  if (!WEBHOOK_URL) throw new Error('Webhook adresi tanımlı değil.')
  const zarf = {
    surum: 1,
    olay,
    id: crypto.randomUUID(),
    zaman: new Date().toISOString(),
    kaynak: 'gunes-mum',
    veri,
  }
  const yanit = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(zarf),
    keepalive: true,
  })
  if (!yanit.ok) throw new Error(`Webhook ${yanit.status} döndü.`)
  return zarf
}

// Arka plan olayları için: beklemez, hata olursa sadece uyarı yazar.
export function webhookGonder(olay, veri) {
  if (!WEBHOOK_URL) return
  webhookGonderBekle(olay, veri).catch((hata) => console.warn('Webhook gönderilemedi:', olay, hata))
}
