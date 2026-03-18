import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [
      totalProducts,
      activeProducts,
      productsByCategory,
      productsByLinea,
      topProducts,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { active: true } }),
      this.prisma.product.groupBy({
        by: ['categoryId'],
        _count: { id: true },
        where: { active: true },
      }),
      this.prisma.product.groupBy({
        by: ['lineaId'],
        _count: { id: true },
        where: { active: true },
      }),
      this.prisma.product.findMany({
        where: { active: true },
        orderBy: { views: 'desc' },
        take: 5,
        select: { id: true, name: true, views: true, img: true },
      }),
    ]);

    const categories = await this.prisma.category.findMany();
    const lineas = await this.prisma.linea.findMany();

    return {
      totalProducts,
      activeProducts,
      productsByCategory: productsByCategory.map((p) => ({
        name: categories.find((c) => c.id === p.categoryId)?.name ?? 'Sin categoría',
        count: p._count.id,
      })),
      productsByLinea: productsByLinea.map((p) => ({
        name: lineas.find((l) => l.id === p.lineaId)?.name ?? 'Sin línea',
        count: p._count.id,
      })),
      topProducts,
    };
  }
}