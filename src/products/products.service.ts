import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateProductDto {
  name: string;
  desc: string;
  precio: number;
  img: string;
  badge?: string;
  biodegradable?: boolean;
  concentrado?: boolean;
  categoryId?: number;
  lineaId?: number;
  aromaId?: number;
  formatoId?: number;
}
export class UpdateProductDto {
  name?: string;
  desc?: string;
  precio?: number;
  img?: string;
  badge?: string;
  biodegradable?: boolean;
  concentrado?: boolean;
  active?: boolean;
  categoryId?: number;
  lineaId?: number;
  aromaId?: number;
  formatoId?: number;
}

export class FilterProductDto {
  categoryId?: number;
  lineaId?: number;
  aromaId?: number;
  formatoId?: number;
  biodegradable?: boolean;
  concentrado?: boolean;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(filters: FilterProductDto = {}) {
    return this.prisma.product.findMany({
      where: {
        active: true,
        ...(filters.categoryId && { categoryId: Number(filters.categoryId) }),
        ...(filters.lineaId && { lineaId: Number(filters.lineaId) }),
        ...(filters.aromaId && { aromaId: Number(filters.aromaId) }),
        ...(filters.formatoId && { formatoId: Number(filters.formatoId) }),
        ...(filters.biodegradable !== undefined && {
          biodegradable: filters.biodegradable === true,
        }),
        ...(filters.concentrado !== undefined && {
          concentrado: filters.concentrado === true,
        }),
      },
      include: {
        category: true,
        linea: true,
        aroma: true,
        formato: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        linea: true,
        aroma: true,
        formato: true,
      },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  create(dto: CreateProductDto) {
    const data: any = {
      name: dto.name,
      desc: dto.desc,
      precio: dto.precio,
      img: dto.img,
      badge: dto.badge,
      biodegradable: dto.biodegradable ?? false,
      concentrado: dto.concentrado ?? false,
    };

    if (dto.categoryId) data.categoryId = Number(dto.categoryId);
    if (dto.lineaId) data.lineaId = Number(dto.lineaId);
    if (dto.aromaId) data.aromaId = Number(dto.aromaId);
    if (dto.formatoId) data.formatoId = Number(dto.formatoId);

    return this.prisma.product.create({
      data,
      include: {
        category: true,
        linea: true,
        aroma: true,
        formato: true,
      },
    });
  }
  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        category: true,
        linea: true,
        aroma: true,
        formato: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }
}
