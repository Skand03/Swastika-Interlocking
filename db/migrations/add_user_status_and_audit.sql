-- ============================================================
-- Migration: Production-grade user table with status, soft-delete,
-- audit log, and failed login tracking
-- Run once against swastika_db
-- ============================================================

USE `swastika_db`;

-- 1. Extend users table
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `status`        ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active' AFTER `email`,
  ADD COLUMN IF NOT EXISTS `provider`      VARCHAR(30)   DEFAULT 'email'         AFTER `status`,
  ADD COLUMN IF NOT EXISTS `last_login_at` TIMESTAMP     NULL                    AFTER `provider`,
  ADD COLUMN IF NOT EXISTS `deleted_at`    TIMESTAMP     NULL                    AFTER `last_login_at`;

-- Remove any accidental duplicate firebase_uid rows before adding unique key
-- (keeps the most recently created row per firebase_uid)
DELETE u1 FROM users u1
  INNER JOIN users u2
  WHERE u1.id < u2.id AND u1.firebase_uid = u2.firebase_uid AND u1.firebase_uid IS NOT NULL;

-- Ensure unique index on firebase_uid if not already present
ALTER TABLE `users`
  DROP INDEX IF EXISTS `uk_firebase_uid`;
ALTER TABLE `users`
  ADD UNIQUE KEY `uk_firebase_uid` (`firebase_uid`);

-- 2. Audit / login history log
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     INT(11)         DEFAULT NULL,
  `action`      VARCHAR(60)     NOT NULL,
  `firebase_uid`VARCHAR(128)    DEFAULT NULL,
  `ip_address`  VARCHAR(45)     DEFAULT NULL,
  `user_agent`  TEXT            DEFAULT NULL,
  `detail`      TEXT            DEFAULT NULL,
  `created_at`  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id`  (`user_id`),
  KEY `idx_action`   (`action`),
  KEY `idx_created`  (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Rate-limit / failed login tracking
CREATE TABLE IF NOT EXISTS `failed_login_attempts` (
  `id`           INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `identifier`   VARCHAR(255)    NOT NULL,  -- email or firebase_uid
  `ip_address`   VARCHAR(45)     NOT NULL,
  `attempt_time` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_identifier` (`identifier`),
  KEY `idx_ip`         (`ip_address`),
  KEY `idx_time`       (`attempt_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Ensure all existing users have status = 'active' (safe default)
UPDATE `users` SET `status` = 'active' WHERE `status` IS NULL OR `status` = '';
