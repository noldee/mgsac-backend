import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateLineaDto {
  name: string;
  description?: string;
}

export class UpdateLineaDto {
  name?: string;
  description?: string;
}

@Injectable()
export class LineasService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.linea.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const linea = await this.prisma.linea.findUnique({ where: { id } });
    if (!linea) throw new NotFoundException('Línea no encontrada');
    return linea;
  }

  create(dto: CreateLineaDto) {
    return this.prisma.linea.create({ data: dto });
  }

  async update(id: number, dto: UpdateLineaDto) {
    await this.findOne(id);
    return this.prisma.linea.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.linea.delete({ where: { id } });
  }
}