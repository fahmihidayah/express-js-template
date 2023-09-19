-- DropForeignKey
ALTER TABLE `Permission` DROP FOREIGN KEY `Permission_role_id_fkey`;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
