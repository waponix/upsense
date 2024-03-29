USE `upsense`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` enum('admin','manager','user') NOT NULL DEFAULT 'user',
  `username` text NOT NULL UNIQUE DEFAULT '',
  `password` text NOT NULL,
  `salt` text NOT NULL,
  `picture` text DEFAULT '',
  `first_name` text DEFAULT '',
  `last_name` text DEFAULT '',
  `email` text NOT NULL UNIQUE DEFAULT '',
  `mobile_number` text DEFAULT NULL,
  `refresh_token_id` int(11) DEFAULT NULL UNIQUE,
  `created_at` bigint(20) NOT NULL DEFAULT 0,
  `updated_at` bigint(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ;

INSERT IGNORE INTO upsense.users (id, role, username, email, password, salt) VALUES
(1, 'admin', 'admin', 'admin@upsense.co', '15069d43e90cfc7ef9e4cbba6e75fffdcf82891c5cbc9ab2eb8806bef725d4a5e6d2f4682dc7a446d2c07a5db14ea125b6f5a2edf80f3b086df6a9b5d6701df42866a21988bd6000a2ccf1ed4c854d12275cce54394fa59180afbbe55669cab616eee687865bce1d8d9828f0782172bfd35f23ee5800dd07b14722dc74c483a8a504ddc960c88a5568abf93c6cb24a94a484301e3885b603b8e84c0a8b9a99ff07ab955467cc811c7b30a1f30046db5e99ab9e27387308043cb13ceb4e7b1f5fd2b0e8888cf0c8267947fe3be6d8fc8f83c13254cedcc9bdf665945cf454a64139517d1ff02c6264b34516eb0f53ba92b1e4e0d9bd69ec8f6d1fef28b6a712feed8eddd2dc02051d8a9aee18e7a7015a1544542155318caed32644b08f57f5d92d6dc96bb9bd52e7b7b1451f9f81e6144e7727945b866a04df87a4ed1f07920180443cfa49f2aa1cd36aaf12d0259f642056dce375e4ea0c8949b27abebd1fb197eebb0a1c4cadb7a999fccfdfd8bee337160893e5fb5592dca456bd388824db81f4130c39bb5b4b074d7fdbe9a79d52fd6f903c78a33fbe3a4264aad970a34cd97b0bd135f14f2d0d104c190277fc97e45d3d9e13fde64b26dfb85e79b8f33df734f40d8ebbbd97c16b584b435bc822f672971bc1ab6a582f6f45e426ae16653c6aa3aef09914abf38bcf0d03582a3db6026f829c9d3404256abc9685aa29b8', '3d2e2365f1257c1dddeeda087efcd6b4')
LIMIT 1;
