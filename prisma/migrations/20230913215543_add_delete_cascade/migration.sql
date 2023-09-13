-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_category_id_fkey`;

-- AlterTable
ALTER TABLE `Task` ALTER COLUMN `category_id` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
