/*
  Warnings:

  - You are about to drop the column `sender` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `aiResponded` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `assignedToId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `resolved` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `unitId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the `Property` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PropertyStaff` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tenant" DROP CONSTRAINT "Tenant_unitId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_assignedToId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_unitId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "_PropertyStaff" DROP CONSTRAINT "_PropertyStaff_A_fkey";

-- DropForeignKey
ALTER TABLE "_PropertyStaff" DROP CONSTRAINT "_PropertyStaff_B_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "sender";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "aiResponded",
DROP COLUMN "assignedToId",
DROP COLUMN "category",
DROP COLUMN "priority",
DROP COLUMN "resolved",
DROP COLUMN "tenantId",
DROP COLUMN "unitId",
ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "Property";

-- DropTable
DROP TABLE "Staff";

-- DropTable
DROP TABLE "Tenant";

-- DropTable
DROP TABLE "Unit";

-- DropTable
DROP TABLE "_PropertyStaff";

-- DropEnum
DROP TYPE "MessageSender";

-- DropEnum
DROP TYPE "StaffRole";

-- DropEnum
DROP TYPE "TicketCategory";

-- DropEnum
DROP TYPE "TicketPriority";
