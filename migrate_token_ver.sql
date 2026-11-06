-- Bir kez çalıştırın (D1 Console). Mevcut verileri silmez.
ALTER TABLE users ADD COLUMN token_ver INTEGER NOT NULL DEFAULT 0;
