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

**Gizlilik:** Kişisel veriden yalnızca olayın işi için gereken alanlar gönderilir: kimlik için `ad` ve `eposta`, siparişte geri arama için `telefon`. Şifre, `sifreOzeti` ve `tuz` hiçbir olayın içinde yer almaz.

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

### `siparis.olusturuldu`
"Sipariş verin" formundan gönderilir (`src/siparis.js` → `siparisGonder`).
```json
{
  "siparisNo": "GM-20261005-0427",
  "ad": "Ali Veli",
  "telefon": "05551234567",
  "urunler": [
    { "id": 1, "ad": "Lavanta Kavanoz Mum", "adet": 1, "birimFiyat": 249, "araToplam": 249 }
  ],
  "toplamAdet": 1,
  "toplamTutar": 249,
  "paraBirimi": "TRY"
}
```
`telefon` boşluk, tire ve parantez atılmış hâliyle gönderilir. `urunler` dizisi ileride sepetten sipariş için birden fazla ürün taşıyabilir.

### `stok.bildirim_istendi`
Tükenen üründe "Gelince haber ver" penceresinden gönderilir (`stokBildirimiGonder`).
```json
{
  "ad": "Ali Veli",
  "eposta": "ali.veli@example.com",
  "urun": { "id": 3, "ad": "Güneş Hediye Seti" }
}
```

Yeni bir olay eklenirse önce bu listeye eklenir, sonra kodda kullanılır.

## Gönderim

Gönderim kodu `src/webhook.js` dosyasındadır. Zarfı o dosya oluşturur; olay gönderen kod yalnızca `olay` ve `veri` verir.

- **Formlar** (sipariş, stok bildirimi) `webhookGonderBekle(olay, veri)` fonksiyonunu `await` ile çağırır. Gönderim başarısız olursa kullanıcıya ne olduğunu ve ne yapabileceğini söyleyen bir hata gösterilir; onay ekranı yalnızca başarılı gönderimden sonra çıkar.
- **Arka plan olayları** (`uye.kaydoldu`, `sepet.guncellendi` gibi) `webhookGonder(olay, veri)` ile gönderilir. Kullanıcının işlemini beklemez, hata olursa yalnızca `console.warn` ile kayda geçer.
- Adres `VITE_WEBHOOK_URL` değişkeninden okunur: yerelde `.env` dosyası (örnek: `.env.example`), yayında GitHub deposunun Actions değişkeni (`Settings → Secrets and variables → Actions → Variables`). Tanımlı değilse formlar hata gösterir, arka plan olayları gönderilmez.
- Alıcı tarayıcıdan gelen istekleri kabul etmek için CORS başlıklarını göndermelidir (webhook.site'ta "CORS headers" seçeneği).

**Güvenlik notu:** `VITE_` ile başlayan değişkenler tarayıcıya gönderilen koda gömülür, yani sayfayı açan herkes webhook adresini görebilir. Bu nedenle adres gizli bir anahtar içermemelidir. İmzalı ya da gizli anahtarla korunan webhook'lar sunucu tarafından gönderilmelidir.
