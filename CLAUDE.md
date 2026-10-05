# Güneş Mum

## Sektör
El yapımı doğal mum atölyesi. Soya ve arı mumu kullanılır, her mum küçük partiler hâlinde elde dökülür.

## Hedef Kitle
25–45 yaş arası, evinde huzurlu bir ortam yaratmak isteyen, doğal ürünlere önem veren
ve özel günler için anlamlı hediye arayan kişiler.

## Ürün Kategorileri
- Kavanoz mumlar
- Dekoratif mumlar
- Hediye setleri

## Ton
Sıcak, samimi ve sakin. Abartılı satış dili kullanılmasın.

## Teknik
- React + Vite projesi. Çalıştırma: `npm run dev`, derleme: `npm run build`.
- Yayın: GitHub Pages, https://mehmetoktay2016.github.io/gunes-mum/ (repo: github.com/mehmetoktay2016/gunes-mum).
  `main`'e her push'ta `.github/workflows/deploy.yml` derleyip yayınlar. Build ve preview `/gunes-mum/` alt adresini
  kullanır (`vite.config.js`), dev sunucusu kökte çalışır. Kökten başlayan görsel yolları (`/gorseller/...`)
  ProductImage içinde `BASE_URL`'e göre çözülür.
- Ürünler `src/urunler.js` içinde tutulur (alanlar: id, ad, aciklama, fiyat, stok, gorsel; `stok: 0` = tükendi, şu an Güneş Hediye Seti). Kullanıcı izni olmadan bu veriyi değiştirme.
- Bileşenler `src/components/` içinde: ProductList (katalog) → ProductCard (kart) → ProductImage (görsel; görsel yoksa 🕯️ gösterir).
  Başlıkta UserMenu (üye alanı) ve CartSummary (sepet özeti) var. Katalogdan sonra OrderForm ("Sipariş verin") ve ContactInfo (iletişim) gelir;
  içinde CatalogQR (`qrcode.react`, `atolye.js` içindeki `siteAdresi`'ni açan QR kod) var.
  LoginDialog (giriş) ve RegisterDialog (üye ol) ortak Modal kabuğunu (native `<dialog>`) kullanır.
  Hangi pencerenin açık olduğu App'te `pencere` state'inde: null | 'giris' | 'kayit'.
  Tükenen üründe StockAlertDialog ("Gelince haber ver") açılır; açık olduğu ürün App'te `stokUrunu` state'inde.
  Başlıkta yalnızca "Giriş yap" butonu var; üye olma penceresi giriş penceresindeki "Üye olun" bağlantısıyla açılır
  (kullanıcı tercihi: başlıkta ayrı "Üye ol" butonu olmasın).
- Atölye bilgileri `src/atolye.js` içinde: `siteAdresi`, `sosyalMedya` (alt bilgideki SocialLinks simgeleri;
  Simple Icons paketinden Facebook, Instagram, X, TikTok; hesap adları uydurma), `iletisim` (adres, telefon, e-posta, Instagram, çalışma saatleri)
  ve `demoUye`. Bu değerler uydurmadır; e-postalar `example.com` kullanır.
- Üyelik DEMO (sunucu yok), mantığı `src/uyelik.js` içinde:
  - Kayıtlı üyeler localStorage `gunes-mum-uyeler` dizisinde: `{ ad, eposta, tuz, sifreOzeti }`.
    Şifre düz metin saklanmaz, tuzlanmış SHA-256 özeti tutulur (crypto.subtle; localhost/https gerekir).
  - Giriş: demo hesap (`demoUye`) ya da kayıtlı üyeler kabul edilir. E-postalar küçük harfe çevrilir.
  - Kayıt doğrulaması: ad ≥ 2 karakter, geçerli e-posta, e-posta daha önce kayıtlı olmamalı, şifre ≥ 8, şifreler aynı.
  - Kayıt sonrası otomatik giriş yapılır. "Örnek bilgilerle doldur" uydurma bir üye üretir (`rastgeleUye`).
  - Giriş yapan üye localStorage `gunes-mum-uye` anahtarında `{ ad, eposta }` olarak tutulur.
  - Gerçek bir sitede kayıt ve giriş sunucu tarafında yapılmalı.
- Sepet: `App.jsx` içinde `{ ürünId: adet }` olarak tutulur, localStorage'da `gunes-mum-sepet` anahtarıyla saklanır.
  Toplam adet ve tutar satıştaki (stok > 0) ürünler üzerinden hesaplanır (fiyat sepette tekrar tutulmaz).
  Tükenen ürün sepete eklenemez.
  ProductCard durumsuzdur: `adet`, `onEkle`, `onAzalt`, `onStokBildirimi` prop'larını alır.
- Formlar ve webhook: sipariş ve stok bildirimi mantığı `src/siparis.js`, gönderim `src/webhook.js`.
  Olay biçimleri (`siparis.olusturuldu`, `stok.bildirim_istendi`) skill'deki `webhook.md` dosyasında.
  Adres `VITE_WEBHOOK_URL`: yerelde `.env` (örnek `.env.example`), yayında repo Actions değişkeni.
  Alıcı CORS başlıklarını göndermeli (webhook.site'ta "CORS headers" açık olmalı).
- Ürün görselleri `public/gorseller/` klasöründe (lavanta.png, bal-petegi.png, hediye-seti.png). Fotoğraflar dikey (512×1024).
- Stiller `src/App.css` içinde.
- `index.static.html`: React'e geçmeden önceki düz HTML sürümü, sadece referans.
- Yanıtlar Türkçe olsun.
- Kod yazma standartları (bileşen, stil, erişilebilirlik, metin) ve webhook formatı: `.claude/skills/atolyekart/` skill'i.

## Tasarım
- Atmosfer: fotoğraflardaki mum ışığı. Koyu, sıcak zemin; krem/açık zemine geri dönme.
- Renkler `:root` değişkenlerinde: gece `#1f1714` (zemin), fitil `#3d302a` (çizgiler),
  balmumu `#f3e6d3` (yazı), kül `#b8a593` (ikincil yazı), alev `#f2a541` (fiyat, buton),
  kor `#2a201b` (form alanı zemini), hata `#ff9b85` (hata metni).
- Yazı tipleri (Google Fonts, `index.html` içinde): Young Serif (logo, ürün adı, fiyat) + Hanken Grotesk (metin).
- Ürün fotoğrafları kemerli çerçevede, 4:5 oranında, arkasında hafif alev ışıltısı. Kartların etrafında kutu yok.
- Fiyat ve "Sepete ekle" satırı kartların altında aynı hizada durur.
- Ürün sepette yoksa "Sepete ekle" butonu, varsa `− adet +` seçici gösterilir.
- Sepet özeti masaüstünde başlığın sağ üstünde, mobilde (≤ 600px) logonun altında ortalı durur.
- Henüz yok: sepet içeriğini listeleyen panel, ödeme/sipariş akışı.
