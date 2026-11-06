BORÇ TAKİP – BULUT HESABI VE OTOMATİK JSON YEDEKLEME

Bu paket iki PWA'ya da kayıt/giriş ve kullanıcıya özel JSON bulut yedekleme ekler. Mevcut yerel JSON yedekleme korunur.

CLOUDFLARE PAGES KURULUMU
1) Admin ve Users projelerinin her ikisinde de aynı Pages Functions kodunu yayınlayın. ZIP içindeki functions/ klasörünü ilgili projenin köküne koyun. index.html, manifest.json ve sw.js kökte kalmalı.
2) Cloudflare Dashboard > Workers & Pages > ilgili Pages projesi > Settings > Bindings bölümünden D1 database binding ekleyin: değişken adı DB.
3) Aynı bölümden R2 bucket binding ekleyin: değişken adı BACKUPS. Her iki Pages projesi aynı D1 veritabanını ve aynı R2 bucket'ı kullanmalı.
4) D1 Console'da schema.sql dosyasının içeriğini bir kez çalıştırın.
5) Her iki Pages projesinde Settings > Variables and Secrets bölümüne AUTH_SECRET adlı Secret ekleyin. İki projede de aynı, uzun ve rastgele bir değer kullanın (en az 32 karakter).
6) Her iki projeyi yeniden deploy edin.

KULLANIM
- İlk açılışta Kayıt Ol ile kullanıcı adı (3-24 karakter) ve şifre (en az 8 karakter) oluşturulur. İlk cihazdaki mevcut veriler ilk bulut yedeği olarak yüklenir.
- Başka telefonda Giriş Yap seçilir. Aynı kullanıcı adı/şifre ile giriş yapılınca son JSON yedeği uygulamaya geri yüklenir.
- Veri değişiklikleri yaklaşık 1,4 saniye sonra otomatik yedeklenir. Uygulama kapalıyken tarayıcı arka planda sürekli çalışmak zorunda değildir; değişiklik olduğunda ve uygulama kullanılırken yedek gönderilir.
- Yerel JSON indir/yükle özelliği kaldırılmamıştır.

ÖNEMLİ
- Kullanıcı adları herkese açık olabilir; hesap güvenliği şifreyle sağlanır. Şifreyi unutma/hesap kurtarma akışı bu ilk sürümde yoktur.
- Her kullanıcının yedeği UUID tabanlı ayrı R2 anahtarında saklanır; API kullanıcı kimliğini imzalı oturumdan alır, istemciden gelen user_id'ye güvenmez.
- Admin ve Users aynı DB/R2 kaynaklarını kullanmalıdır; farklı kaynaklara bağlanırsa hesaplar ortak görünmez.
- Bu ilk paket AI API anahtarını sunucuya taşıma ve AI sohbet hafızasını D1'e kaydetme işini henüz tamamlamaz. Gemini anahtarını HTML/Gist üzerinden yayınlamayın; AI proxy entegrasyonu ayrı aşamada yapılmalıdır.

GİZLİLİK: JSON yedekleri istemcide AES-GCM ile şifrelenir. Şifre unutulursa Cloudflare yedeği çözülemez; kullanıcı ilk cihazındaki yerel veriden manuel JSON yedeği almış olmalıdır.
