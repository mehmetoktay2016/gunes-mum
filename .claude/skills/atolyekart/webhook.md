# AtölyeKart Webhook Formatı

AtölyeKart'ta bir olay olduğunda (ör. üye kaydı ya da sepet değişikliği) başka bir sisteme (n8n, Zapier, Slack vb.) gönderilecek verinin standart biçimi. Bütün olaylar aynı **zarfın** içinde gönderilir, olaya özel bilgiler `veri` alanına yazılır.

## Zarf

```json
{
  "surum": 1,
  "olay": "sepet.guncellendi",
  "id": "8f14e45f-ceea-4f6b-9a1c-2d3e4f5a6b7c",
  "zaman": "2026-10-05T14:30:00.000Z",
  "kaynak": "gunes-mum",
  "veri": { }
}
```

| Alan | Açıklama |
|---|---|
| `surum` | Formatın sürümü. Alan silinir ya da anlamı değişirse artırılır. Yeni alan eklemek sürümü değiştirmez. |
| `olay` | `nesne.gecmis_zaman_fiil` biçiminde. Olay listesi aşağıda. |
| `id` | Her gönderim için `crypto.randomUUID()`. Alıcı sistem aynı olayı iki kez işlememek için bunu kullanır. |
| `zaman` | Olayın zamanı, UTC, ISO 8601 (`new Date().toISOString()`). |
| `kaynak` | Her zaman `"gunes-mum"`. |
| `veri` | Olaya özel içerik. |

**Alan adları** Türkçe camelCase ve yalnızca ASCII harflerle yazılır: `surum`, `araToplam`, `paraBirimi`. Türkçe karakter kullanılmaz (`sürüm` değil). Tutarlar TL cinsinden sayı olarak yazılır ve yanlarına `"paraBirimi": "TRY"` eklenir.

**Gizlilik:** Üye bilgisinden yalnızca `ad` ve `eposta` gönderilir. Şifre, `sifreOzeti` ve `tuz` hiçbir olayın içinde yer almaz.

## Olaylar

### `uye.kaydoldu`
```json
{ "ad": "Ali Veli", "eposta": "ali.veli@example.com" }
```

### `uye.giris_yapti`
```json
{ "eposta": "ali.veli@example.com" }
```

### `sepet.guncellendi`
Sepetin değişiklikten sonraki tam hâli gönderilir. Sadece değişen kısım gönderilmez.
```json
{
  "urunler": [
    { "id": 1, "ad": "Lavanta Kavanoz Mum", "adet": 2, "birimFiyat": 249, "araToplam": 498 }
  ],
  "toplamAdet": 2,
  "toplamTutar": 498,
  "paraBirimi": "TRY",
  "uyeEposta": "ali.veli@example.com"
}
```
Üye giriş yapmamışsa `uyeEposta` değeri `null` olur.

### `siparis.olusturuldu` (ödeme adımı eklendiğinde)
`sepet.guncellendi` ile aynı alanlara ek olarak `"siparisNo": "GM-20261005-0001"` alanı bulunur.

Yeni bir olay eklenirse önce bu listeye eklenir, sonra kodda kullanılır.

## Gönderim

- Gönderim için `src/webhook.js` içindeki `webhookGonder(olay, veri)` kullanılır. Dosya yoksa önce aşağıdaki biçimde oluşturulur.
- Adres `.env` dosyasındaki `VITE_WEBHOOK_URL` değişkeninden okunur. Bu değişken tanımlı değilse gönderim yapılmaz ve uygulama normal şekilde çalışmaya devam eder.
- Gönderim, kullanıcının işlemini beklemez ve bozmaz. Hata olursa yalnızca `console.warn` ile kayda geçer.

```js
// Olayları standart zarf içinde webhook adresine gönderir (.claude/skills/atolyekart/webhook.md).
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL

export function webhookGonder(olay, veri) {
  if (!WEBHOOK_URL) return
  const zarf = {
    surum: 1,
    olay,
    id: crypto.randomUUID(),
    zaman: new Date().toISOString(),
    kaynak: 'gunes-mum',
    veri,
  }
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(zarf),
    keepalive: true,
  }).catch((hata) => console.warn('Webhook gönderilemedi:', olay, hata))
}
```

**Güvenlik notu:** `VITE_` ile başlayan değişkenler tarayıcıya gönderilen koda gömülür, yani sayfayı açan herkes webhook adresini görebilir. Bu nedenle adres gizli bir anahtar içermemelidir. İmzalı ya da gizli anahtarla korunan webhook'lar sunucu tarafından gönderilmelidir.
