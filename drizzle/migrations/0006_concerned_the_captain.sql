ALTER TABLE `definitions` MODIFY COLUMN `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending';