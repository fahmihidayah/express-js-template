-- CreateTable
CREATE TABLE "_AuthPermissionToGroup" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AuthPermissionToGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "AuthPermission" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AuthPermissionToGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuthPermissionToGroup_AB_unique" ON "_AuthPermissionToGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthPermissionToGroup_B_index" ON "_AuthPermissionToGroup"("B");
