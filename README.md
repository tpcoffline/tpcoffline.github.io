# Tpcoffline - Minecraft Developer Portfolio

Modern, responsive ve Minecraft temalı bir geliştirici portföy sitesi.

## 🎮 Özellikler

- **Minecraft Temalı Tasarım**: Minecraft renklerine ve stiline uygun modern tasarım
- **Koyu/Açık Tema**: Kullanıcı tercihi kaydedilen tema değiştirme
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **JSON Tabanlı İçerik**: Kolayca düzenlenebilir proje ve bilgi yönetimi
- **Proje Filtreleme**: Kategorilere göre proje filtreleme sistemi
- **Animasyonlu Geçişler**: Smooth scroll ve hover animasyonları
- **Modal Proje Detayları**: Projeler için detaylı popup görünümü

## 📁 Dosya Yapısı

```
portfolyo/
├── index.html          # Ana HTML dosyası
├── styles.css          # CSS stilleri
├── script.js           # JavaScript fonksiyonları
├── data/              # JSON veri dosyaları
│   ├── organizations.json
│   ├── projects.json
│   ├── social-links.json
│   └── categories.json
├── assets/            # Resim ve medya dosyaları
└── README.md
```

## 🔧 Nasıl Kullanılır

### 1. Projeleri Düzenleme
`data/projects.json` dosyasını düzenleyerek yeni projeler ekleyebilir veya mevcut projeleri güncelleyebilirsiniz:

```json
{
    "id": 9,
    "title": "Yeni Projem",
    "description": "Proje açıklaması",
    "image": "proje-resmi-url",
    "categories": ["Datapack", "Plugin"],
    "tags": ["tag1", "tag2"],
    "downloadLink": "indirme-linki",
    "videoLink": "video-linki",
    "details": "Detaylı açıklama",
    "version": "1.20+",
    "downloads": 100,
    "features": [
        "Özellik 1",
        "Özellik 2"
    ]
}
```

### 2. Kuruluşları Güncelleme
`data/organizations.json` dosyasından çalıştığınız kuruluşları yönetebilirsiniz:

```json
{
    "id": 5,
    "logo": "logo-url",
    "title": "Kuruluş Adı",
    "detail": "Kuruluş detayları",
    "active": true
}
```

### 3. Sosyal Medya Linklerini Düzenleme
`data/social-links.json` dosyasından iletişim bilgilerinizi güncelleyebilirsiniz:

```json
{
    "id": 7,
    "icon": "fab fa-platform",
    "title": "Platform Adı",
    "link": "platform-linki",
    "hoverText": "Hover mesajı"
}
```

### 4. Yeni Kategori Ekleme
`data/categories.json` dosyasından yeni proje kategorileri ekleyebilirsiniz:

```json
{
    "id": 8,
    "name": "Yeni Kategori",
    "icon": "fas fa-icon"
}
```

## 🚀 GitHub Pages'te Yayınlama

1. Bu repository'yi GitHub hesabınıza fork edin
2. Repository ayarlarından Pages sekmesine gidin
3. Source olarak "Deploy from a branch" seçin
4. Branch olarak "main" seçin
5. Save butonuna tıklayın
6. Siteniz `https://kullanici-adi.github.io/repository-adi` adresinde yayınlanacak

## 🎨 Özelleştirme

### Renkleri Değiştirme
`styles.css` dosyasındaki CSS değişkenlerini düzenleyerek site renklerini özelleştirebilirsiniz:

```css
:root {
    --primary-color: #00c851;
    --minecraft-green: #55ff55;
    --minecraft-gold: #ffaa00;
    /* ... diğer renkler */
}
```

### Logo Değiştirme
`assets/` klasörüne kendi logonuzu ekleyin ve `index.html` dosyasındaki logo yolunu güncelleyin:

```html
<img src="assets/your-logo.png" alt="Logo" class="logo-img">
```

## 📱 Responsive Tasarım

Site tüm cihaz boyutlarında optimize edilmiştir:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (767px ve altı)

## 🔧 Teknik Detaylar

- **HTML5** semantic markup
- **CSS3** modern özellikler (Grid, Flexbox, Custom Properties)
- **Vanilla JavaScript** (framework dependency yok)
- **Font Awesome** iconlar
- **Google Fonts** typography
- **LocalStorage** tema tercihi kaydetme

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'e push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **GitHub**: [@tpcoffline](https://github.com/tpcoffline)
- **Discord**: tpcoffline#0000
- **E-mail**: tpcoffline@example.com

---

Minecraft geliştirici portföyünüz için modern ve profesyonel bir çözüm! 🎮✨ 