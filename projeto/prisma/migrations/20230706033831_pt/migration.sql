-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "admin" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Cargo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "nucleo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_senha_key" ON "Usuario"("senha");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_gender_key" ON "Usuario"("gender");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cargo_key" ON "Usuario"("cargo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_admin_key" ON "Usuario"("admin");

-- CreateIndex
CREATE UNIQUE INDEX "Cargo_nome_key" ON "Cargo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Cargo_nucleo_key" ON "Cargo"("nucleo");
