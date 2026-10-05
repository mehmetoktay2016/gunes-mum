---
name: atolyekart
description: AtölyeKart (Güneş Mum) React bileşen standartları ve webhook formatı. Kullan - src/components altında bileşen yazarken veya değiştirirken, App.css'e stil eklerken, webhook/olay verisi üretirken veya gönderirken.
---

# AtölyeKart Standartları

AtölyeKart, Güneş Mum atölyesinin React + Vite katalog sayfasıdır. Bu skill, yeni kodun mevcut kodla aynı biçimde yazılmasını sağlar. Projenin bilgileri (renk değerleri, dosya yerleri, sepet ve üyelik yapısı) `CLAUDE.md` dosyasındadır. Bu dosya ise **nasıl yazılacağını** anlatır.

Webhook ya da olay verisiyle ilgili bir iş varsa önce [`webhook.md`](webhook.md) dosyasını oku.

## Bileşen dosyası

- Her bileşen `src/components/` içinde kendi dosyasındadır. Bileşen adı İngilizce ve PascalCase olur (`ProductCard.jsx`).
- Biçim: dosyanın en üstünde importlar, bileşenin üstünde rolünü anlatan **tek satırlık Türkçe yorum**, `function Ad(props)` ve dosya sonunda `export default Ad`.
- Prop, değişken ve fonksiyon adları **Türkçe camelCase** yazılır (`urun`, `adet`, `acik`). Olay prop'ları `on` + Türkçe fiil biçimindedir (`onEkle`, `onAzalt`, `onKapat`, `onGirisAc`).
- Yeni bir ihtiyaç için önce mevcut parçalar kullanılır: pencere için `Modal`, ürün görseli için `ProductImage`, butonlar için `sepet-buton` (birincil), `ikincil-buton` ve `metin-buton` sınıfları.

## Veri ve durum (state)

- Bileşenler veriyi prop olarak alır. Veri dosyalarını (`urunler.js`, `atolye.js`) yalnızca `App.jsx` ve iş mantığı modülleri (`uyelik.js` gibi) import eder.
- Bileşenler iş mantığı modüllerini doğrudan çağırabilir (`LoginDialog` → `girisKontrol`).
- Paylaşılan durum (sepet, üye, açık pencere) `App.jsx` içinde tutulur. Bileşen yalnızca kendine ait geçici arayüz durumunu tutar (form alanları, hata metni, `bekliyor`). Kartlar ve listeler durumsuzdur.
- Kalıcı bilgi localStorage'da `gunes-mum-<ad>` anahtarıyla saklanır. Okuma ve yazma için `App.jsx` içindeki `nesneOku` / `kaydet` kullanılır. Bunlar bozuk kayıtta varsayılan değere döner.

## Stil

- Tüm stiller `src/App.css` dosyasındadır. Sınıf adları Türkçe kebab-case yazılır (`urun-ad`, `sepet-ozeti`). Bir sınıfın türevi `--` ile gösterilir (`urun-gorsel--bos`).
- Renkler `:root` değişkenlerinden alınır (`var(--alev)`). Yeni bir renk gerekiyorsa önce `:root`'a token olarak eklenir, sonra kullanılır. Işıltılar için alevin saydam hâli `rgba(242, 165, 65, α)`, gölge ve arka plan perdesi için saydam siyah kullanılır.
- Yazı tipleri `var(--font-baslik)` (ad, fiyat, başlık) ve `var(--font-metin)` (geri kalan her şey) değişkenlerinden alınır.
- Her metnin zeminine karşı kontrastı en az 4.5:1 olmalı.
- Sayfa 390px genişlikte yatay kaydırma olmadan çalışmalı. Dar ekran kuralları `@media (max-width: 600px)` bloğuna yazılır.
- Geçiş efektleri (transition) yalnızca kullanıcı etkileşimine yanıt olarak kullanılır ve `prefers-reduced-motion` bloğuna eklenir.

## Erişilebilirlik

- Tıklanan her şey `<button type="button">` (form gönderimi için `type="submit"`) olur. Dokunma alanı en az 44×44px.
- Sadece simge içeren butonun `aria-label` değerinde ürün adı geçer ("Lavanta Kavanoz Mum adedini artır").
- Her buton ve alan `:focus-visible` ile görünür bir odak çizgisi alır.
- Kendiliğinden değişen bilgiler `aria-live="polite"`, form hataları `role="alert"` ile işaretlenir.
- Her `<input>` bir `<label htmlFor>` ile eşleşir.

## Metin

- Arayüz dili Türkçedir ve yalnızca cümlenin ilk harfi büyük yazılır ("Sepete ekle", "Bize ulaşın").
- Butonlar yapacakları işi fiille söyler. Aynı iş her yerde aynı adla geçer ("Giriş yap" butonu, "Giriş yapın" bağlantısı).
- Hata mesajı neyin yanlış olduğunu ve nasıl düzeltileceğini söyler ("Şifre en az 8 karakter olmalı.").
- Para `tutar.toLocaleString('tr-TR') + ' TL'` biçiminde yazılır (1.047 TL).

## Bitti sayılması için

İş ancak şu koşulların **hepsi** sağlandığında bitmiş sayılır:

1. `npm run build` hatasız tamamlanıyor.
2. Değişen her bileşen yukarıdaki dosya, veri, stil, erişilebilirlik ve metin kurallarının her birine uyuyor.
3. `App.css` içinde `:root` dışında yeni bir renk kodu (hex) yok.
4. Yeni bir bileşen ya da yapı eklendiyse `CLAUDE.md` içindeki ilgili satır güncellendi.
