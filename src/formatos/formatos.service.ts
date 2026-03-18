import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateFormatoDto {
  name: string;
  description?: string;
}

export class UpdateFormatoDto {
  name?: string;
  description?: string;
}

@Injectable()
export class FormatosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.formato.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const formato = await this.prisma.formato.findUnique({ where: { id } });
    if (!formato) throw new NotFoundException('Formato no encontrado');
    return formato;
  }

  create(dto: CreateFormatoDto) {
    return this.prisma.formato.create({ data: dto });
  }

  async update(id: number, dto: UpdateFormatoDto) {
    await this.findOne(id);
    return this.prisma.formato.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.formato.delete({ where: { id } });
  }
}