# X Kelime Filtresi

Chrome ve Chromium tabanlı tarayıcılarda X gönderilerini ve içlerindeki alıntıları tarar. Eşleşme durumunda dıştaki gönderinin tamamına seçtiğin işlemi uygular.

## Kurulum

1. [GitHub Releases](https://github.com/neaRRRRR/x-keyword-filter/releases/latest) sayfasından `x-keyword-filter.zip` dosyasını indir ve aç.
2. Tarayıcının uzantılar sayfasını aç. Chrome’da `chrome://extensions`, Brave’de `brave://extensions`, Edge’de `edge://extensions`.
3. **Geliştirici modu**nu aç. **Paketlenmemiş öğe yükle** seçeneğiyle `manifest.json` içeren `x-keyword-filter` klasörünü seç.
4. Açık X sekmelerini yenile.

[Chrome’un yerel kurulum kılavuzu](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)

Önceki sürümdeki kayıtlı listeleri korumak için ZIP’teki uzantı dosyalarını daha önce yüklediğin klasöre kopyala. Uzantılar sayfasında **Yeniden yükle**’ye bas.

## Ayarlar

Uzantı, tarayıcının arayüz dili İngilizce olduğunda İngilizce açılır. Diğer arayüz dillerinde Türkçe kullanılır.

Tarayıcı araç çubuğundaki uzantı menüsünden **X Kelime Filtresi**’ni aç. **Bulanıklaştır** varsayılan işlemdir ve gönderinin akıştaki yerini korur. **Kaldır**, eşleşen gönderi öğesini sayfadan çıkarır.

Bulanık bir gönderinin sağ üstündeki **Göster** düğmesiyle o gönderiyi açabilirsin.

İlk kurulumda kelime listeleri boştur. **Yeni liste** ile istediğin konu için bir liste oluşturabilirsin. Bir listeyi seçip adını, etkinliğini ve kelimelerini düzenle. Etkin listeler birlikte çalışır ve tarayıcıda saklanır. Değişiklikleri kaydettikten sonra açık X sekmelerini yenile.

Filtre, X’in yüklediği gönderi ve alıntı metinlerini, görünen hesap adlarını, bağlantıları ve mevcut alternatif metinleri tarayıcıda inceler. Görseldeki yazıyı yakalamak için X’te erişilebilir bir metin karşılığı gerekir.

## Test

`tests/filter.html` dosyasını Chromium’da aç. Sayfa her iki modda ana gönderi ve alıntı eşleşmelerini, sonradan gelen gönderileri, ilk gösterimden önceki korumayı, aktif listeleri ve ayarların kaydedilmesini denetler.
