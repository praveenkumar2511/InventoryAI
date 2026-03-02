import { z } from "zod";
import { prisma } from "./db";
import bcrypt from "bcrypt";

// --- SCHEMAS ---

export const AuthSchema = z.object({
    module: z.literal("auth"),
    action: z.enum(["register", "login"]),
    data: z.object({
        email: z.string().email(),
        password: z.string().min(6),
    }),
});

export const InventorySchema = z.object({
    module: z.literal("inventory"),
    action: z.enum(["insert", "update", "delete", "select"]),
    operation: z.enum(["increment", "decrement"]).optional(),
    data: z.object({
        name: z.string().optional(),
        quantity: z.number().optional(),
        expiry: z.string().optional(),
        warrantyYears: z.number().optional(),
    }).optional(),
    filter: z.object({
        name: z.string().optional(),
    }).optional(),
});

// --- HANDLERS ---

export async function handleAuth(parsed: any) {
    const { action, data } = AuthSchema.parse(parsed);

    if (action === "register") {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: { email: data.email, password: hashedPassword },
        });
        return { success: true, message: `User ${user.email} registered successfully` };
    }

    if (action === "login") {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new Error("Invalid credentials");
        }
        return { success: true, message: "Logged in successfully" };
    }
}

export async function handleInventory(parsed: any) {
    const { action, operation, data, filter } = InventorySchema.parse(parsed);

    if (action === "insert") {
        const item = await prisma.inventoryItem.upsert({
            where: { name: data?.name! },
            update: { quantity: { increment: data?.quantity || 0 } },
            create: {
                name: data?.name!,
                quantity: data?.quantity || 0,
                expiry: data?.expiry ? new Date(data.expiry) : undefined,
                warrantyYears: data?.warrantyYears
            },
        });
        return { success: true, message: `Inserted ${data?.quantity} ${data?.name}`, item };
    }

    if (action === "select") {
        const nameFilter = filter?.name || data?.name;
        const items = await prisma.inventoryItem.findMany({
            where: nameFilter ? {
                name: {
                    contains: nameFilter,
                    mode: 'insensitive'
                }
            } : {},
        });
        return { success: true, items };
    }

    if (action === "update") {
        const qty = data?.quantity || 0;
        const item = await prisma.inventoryItem.update({
            where: { name: data?.name! },
            data: {
                quantity: operation === "decrement" ? { decrement: qty } : { increment: qty },
            },
        });
        return { success: true, message: `Updated ${data?.name} quantity`, item };
    }

    if (action === "delete") {
        const nameToDelete = filter?.name || data?.name;
        if (!nameToDelete) throw new Error("Item name is required for deletion");

        await prisma.inventoryItem.delete({
            where: { name: nameToDelete },
        });
        return { success: true, message: `Deleted ${nameToDelete}` };
    }
}
