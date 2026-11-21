# X için GTA VI filtresi

Chrome ve Chromium tabanlı tarayıcılarda X gönderilerini ve içlerindeki alıntıları tarar. Eşleşme durumunda dıştaki gönderinin tamamına seçtiğin işlemi uygular.

## Kurulum

1. ZIP’i aç.
2. Tarayıcının uzantılar sayfasını aç. Chrome’da `chrome://extensions`, Brave’de `brave://extensions`, Edge’de `edge://extensions`.
3. **Geliştirici modu**nu aç. **Paketlenmemiş öğe yükle** seçeneğiyle `manifest.json` içeren `gta-vi-x-filter` klasörünü seç.
4. Açık X sekmelerini yenile.

[Chrome’un yerel kurulum kılavuzu](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)

## Ayarlar

Tarayıcı araç çubuğundaki uzantı menüsünden **GTA VI filtresi**ni aç. **Bulanıklaştır** varsayılan ayardır ve gönderinin akıştaki yerini korur. **Kaldır**, eşleşen gönderi öğesini sayfadan çıkarır.

**Yeni liste** ile başka bir oyun veya konu ekleyebilirsin. Bir listeyi seçip adını, aktif durumunu ve kelimelerini düzenle. Etkin listeler birlikte çalışır. Listeler tarayıcıda saklanır ve her listeye istediğin kadar kelime ekleyebilirsin. Değişiklikleri kaydettikten sonra açık X sekmelerini yenile.

[Varsayılan liste](gta-vi-x-filter/keywords.js) oyun adlarını, karakter ve yer adlarını, yayıncıyı ve Türkçe ile İngilizce etiket varyasyonlarını kapsar. GTA V, Rockstar, Jason ve Lucia gibi geniş terimler başka konulardaki gönderilerle de eşleşebilir.

Filtre, X’in yüklediği gönderi ve alıntı metinlerini, görünen hesap adlarını, bağlantıları ve mevcut alternatif metinleri tarayıcıda inceler. Görseldeki yazıyı yakalamak için X’te erişilebilir bir metin karşılığı gerekir.

Listeyi hazırlarken Rockstar’ın [karakter ve yer sayfasını](https://www.rockstargames.com/VI/only-in-leonida/vice-city), [Ultimate Edition içeriğini](https://www.rockstargames.com/VI/editions/ultimate-edition) ve [müzik rehberini](https://www.rockstargames.com/VI/music) kullandım.

## Test

`tests/filter.html` dosyasını Chromium’da aç. Sayfa her iki modda ana gönderi ve alıntı eşleşmelerini, sonradan gelen gönderileri, ilk gösterimden önceki korumayı, aktif listeleri ve ayarların kaydedilmesini denetler.
