import { siFacebook, siInstagram, siTiktok, siX } from 'simple-icons'

// Platform adından marka simgesine (Simple Icons, CC0 lisanslı SVG yolları).
const SIMGELER = { facebook: siFacebook, instagram: siInstagram, x: siX, tiktok: siTiktok }

// Alt bilgideki sosyal medya simgeleri; her biri hesabı yeni sekmede açar.
function SocialLinks({ hesaplar }) {
  return (
    <ul className="sosyal">
      {hesaplar.map((hesap) => {
        const simge = SIMGELER[hesap.platform]
        if (!simge) return null
        return (
          <li key={hesap.platform}>
            <a
              href={hesap.adres}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Güneş Mum ${hesap.ad} hesabı (yeni sekmede açılır)`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={simge.path} />
              </svg>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default SocialLinks
