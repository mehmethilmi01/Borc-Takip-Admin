-- Bir kez çalıştırın (D1 Console). Mevcut verileri silmez.
ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0;
-- Kendi yönetici kullanıcı adınızı yazın:
UPDATE users SET is_admin=1 WHERE username_norm='mehmethilmi0';
