/*
  Warnings:

  - You are about to alter the column `titulo` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(80)`.
  - You are about to alter the column `categoria` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `subcategoria` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `lenguaje` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `titulo` VARCHAR(80) NOT NULL,
    MODIFY `img` VARCHAR(500) NOT NULL,
    MODIFY `categoria` VARCHAR(100) NOT NULL,
    MODIFY `subcategoria` VARCHAR(100) NOT NULL,
    MODIFY `lenguaje` VARCHAR(50) NULL,
    MODIFY `descripcion` VARCHAR(255) NOT NULL;
