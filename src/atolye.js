// Atölye bilgileri. Tüm değerler uydurmadır (demo amaçlı).
// E-postalar örnekler için ayrılmış example.com alan adını kullanır.

// Sitenin yayın adresi (GitHub Pages). Katalogdaki QR kod bu adresi açar.
export const siteAdresi = 'https://mehmetoktay2016.github.io/gunes-mum/'

export const iletisim = {
  adres: 'Fitil Sokak No: 7, Moda, Kadıköy / İstanbul',
  telefon: '0216 555 01 47',
  eposta: 'merhaba@gunesmum.example.com',
  instagram: '@gunesmum.atolye',
  calismaSaatleri: [
    { gunler: 'Salı – Cumartesi', saat: '10:00 – 19:00' },
    { gunler: 'Pazar', saat: '12:00 – 17:00' },
    { gunler: 'Pazartesi', saat: 'Kapalı' },
  ],
}

// Sosyal medya hesapları (alt bilgideki simgeler). Hesap adları uydurmadır; gerçek hesaplarla değiştirin.
// `platform` değeri SocialLinks bileşenindeki simge eşleşmesiyle aynı olmalı.
export const sosyalMedya = [
  { platform: 'facebook', ad: 'Facebook', adres: 'https://www.facebook.com/gunesmum.atolye' },
  { platform: 'instagram', ad: 'Instagram', adres: 'https://www.instagram.com/gunesmum.atolye' },
  { platform: 'x', ad: 'X', adres: 'https://x.com/gunesmumatolye' },
  { platform: 'tiktok', ad: 'TikTok', adres: 'https://www.tiktok.com/@gunesmum.atolye' },
]

// Demo üye hesabı. Gerçek bir giriş sistemi yok; bilgiler tarayıcıda kontrol edilir.
export const demoUye = {
  ad: 'Derya Aksoy',
  eposta: 'derya.aksoy@example.com',
  sifre: 'Mum2026!',
}
