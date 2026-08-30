-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MIDDLE', 'HIGH');

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "task" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "isDone" BOOLEAN NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
