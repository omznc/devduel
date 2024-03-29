import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client/extension";

const prismaClientSingleton = () => {
	return new PrismaClient().$extends({
		model: {
			$allModels: {
				async exists<T>(this: T, where: Prisma.Args<T, "findFirst">["where"]): Promise<boolean> {
					const context = Prisma.getExtensionContext(this);

					// biome-ignore lint/suspicious/noExplicitAny: Prisma stuff
					const result = await (context as any).findFirst({ where });
					return result !== null;
				},
			},
		},
	});
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

/*global globalThis*/
const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
