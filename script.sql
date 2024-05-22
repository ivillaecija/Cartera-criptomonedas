CREATE DATABASE IF NOT EXISTS cartera_criptomonedas;

USE cartera_criptomonedas;

CREATE TABLE IF NOT EXISTS User (
    User_ID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255),
    Surnames VARCHAR(255),
    Email VARCHAR(255) UNIQUE,
    Password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Coin (
    Coin_ID INT AUTO_INCREMENT PRIMARY KEY,
    Internal VARCHAR(255),
    CoinFullName VARCHAR(255),
    ImageUrl VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Wallet (
    User_ID INT,
    Coin_ID INT,
    Quantity DECIMAL(20,10),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Coin_ID) REFERENCES Coin(Coin_ID)
);

CREATE TABLE IF NOT EXISTS Currency (
    Currency_ID INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyName VARCHAR(255),
    Code VARCHAR(255),
    CurrencyNumber INT
);

CREATE TABLE IF NOT EXISTS Purchase (
    Purchase_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_ID INT, 
    Coin_ID INT, 
    Currency_ID INT,
    Quantity DECIMAL(20,10),
    CurrencyQuantity DECIMAL(15,2),
    PurchaseDate TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID),
    FOREIGN KEY (Coin_ID) REFERENCES Coin(Coin_ID),
    FOREIGN KEY (Currency_ID) REFERENCES Currency(Currency_ID)
);

-- Crear el usuario si no existe
CREATE USER IF NOT EXISTS 'ivillaecija'@'localhost' IDENTIFIED BY '221722';

-- Otorgar permisos de acceso a la base de datos cartera_criptomonedas
GRANT USAGE ON cartera_criptomonedas.* TO 'ivillaecija'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON cartera_criptomonedas.* TO 'ivillaecija'@'localhost';

-- Inserts para las diez divisas fiduciarias más populares
INSERT INTO Currency (CurrencyName, Code, CurrencyNumber) VALUES 
    ('Dólar Estadounidense', 'USD', 840),
    ('Euro', 'EUR', 978),
    ('Yen Japonés', 'JPY', 392),
    ('Libra Esterlina', 'GBP', 826),
    ('Dólar Australiano', 'AUD', 36),
    ('Dólar Canadiense', 'CAD', 124),
    ('Franco Suizo', 'CHF', 756),
    ('Corona Sueca', 'SEK', 752),
    ('Dólar Neozelandés', 'NZD', 554);
