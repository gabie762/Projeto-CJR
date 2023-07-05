-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("admin", "cargo", "created_at", "email", "gender", "id", "senha", "username") SELECT "admin", "cargo", "created_at", "email", "gender", "id", "senha", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Cargo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nucleo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cargo_nome_fkey" FOREIGN KEY ("nome") REFERENCES "User" ("username") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Cargo" ("createdAt", "id", "nome", "nucleo") SELECT "createdAt", "id", "nome", "nucleo" FROM "Cargo";
DROP TABLE "Cargo";
ALTER TABLE "new_Cargo" RENAME TO "Cargo";
CREATE UNIQUE INDEX "Cargo_nome_key" ON "Cargo"("nome");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
