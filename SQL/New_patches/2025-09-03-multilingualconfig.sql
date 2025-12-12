ALTER table ConfigSettings ADD COLUMN Multilingual boolean DEFAULT false;
UPDATE ConfigSettings SET Multilingual=true WHERE Name='projectDescription';

CREATE TABLE `ConfigI18n` (
  `Value` text NOT NULL,
  `ConfigID` int(11) DEFAULT NULL,
  `LanguageID` int(10) unsigned DEFAULT NULL,
  KEY `ConfigID` (`ConfigID`),
  KEY `LanguageID` (`LanguageID`),
  CONSTRAINT `ConfigI18n_ibfk_1` FOREIGN KEY (`ConfigID`) REFERENCES `ConfigSettings` (`ID`),
  CONSTRAINT `ConfigI18n_ibfk_2` FOREIGN KEY (`LanguageID`) REFERENCES `language` (`language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample translation of projectDescription for testing. We do not have a
-- foreign key value in the 'language' table to add it to RB.
-- INSERT INTO ConfigI18n VALUES ('このデータベースは、様々な場所で収集された画像データと行動データの両方をオンラインで保存するための仕組みを提供します。このフレームワークには、このプロセスを可能な限り効率的かつシンプルにするためのツールがいくつか用意されています。データベースに関する詳細な情報については、右上のヘルプアイコンをクリックしてください。それ以外の場合は、DCCまでお気軽にお問い合わせください。私たちは、データ収集を楽しいものにすることを目指しています。', 48, 2)
