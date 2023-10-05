SET NAMES 'utf8';

CREATE DATABASE IF NOT EXISTS ccp;

CREATE USER IF NOT EXISTS 'ccpadmin'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON ccp.* TO 'ccpadmin'@'localhost';
FLUSH PRIVILEGES;

USE ccp;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(30) NOT NULL,
    full_name VARCHAR(200),
    email_address VARCHAR(100) UNIQUE NOT NULL,
    amount_games INT,
    winned_games INT
);

CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    codes INT NOT NULL,
    bugs INT NOT NULL,
    energy INT NOT NULL,
    target ENUM('user', 'enemy', 'all') NOT NULL
);

INSERT INTO cards (name, codes, bugs, energy, target)
VALUES
('ChatGPT', 15, 10, -1, 'user'),
('протестировать', 0, -10, -2, 'user'),
('пир ту пир', 10, 10, -3, 'user'),
('читать ПДФ', 10, 0, -3, 'user'),
('StackOverflow', 10, 5, -1, 'user'),
('кофе + энергос', 0, 0, 3, 'user'),
('повербанк', 0, 0, 2, 'user'),
('Я ЖИВИИИИИИИИЙ!', 0, 0, 4, 'user'),
('откл електрики', 0, 0, -7, 'enemy'),
('Wrong ПДФ', -5, 0, 0, 'enemy'),
('Багинатор', 0, 10, 0, 'enemy'),
('подсыпать снотворное', 0, 0, -2, 'enemy'),
('изменение лабы', -15, -5, 0, 'all'),
('тех. неполадки', 0, 10, 0, 'all');

/*
('ChatGPT', 15, 10, -1, 'user'),
('читать ПДФ', 10, 0, -3, 'user'),
('пир ту пир', 10, 10, -3, 'user'),
('протестировать', 0, -10, -2, 'user'),
('StackOverflow', 10, 5, -1, 'user'),
('откл електрики', 0, 0, -7, 'enemy'),
('Wrong ПДФ', -5, 0, 0, 'enemy'),
('Багинатор', 0, 10, 0, 'enemy'),
('подсыпать снотворное', 0, 0, -2, 'enemy'),
('кофе + энергос', 0, 0, 3, 'user'),
('повербанк', 0, 0, 2, 'user'),
('Я ЖИВИИИИИИИИЙ!', 0, 0, 4, 'user'),
('изменение лабы', -15, -5, 0, 'all'),
('тех. неполадки', 0, 10, 0, 'all');*/