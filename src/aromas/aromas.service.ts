import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class CreateAromaDto {
  name: string;
  description?: string;
}

export class UpdateAromaDto {
  name?: string;
  description?: string;
}

@Injectable()
export class AromasService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.aroma.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const aroma = await this.prisma.aroma.findUnique({ where: { id } });
    if (!aroma) throw new NotFoundException('Aroma no encontrado');
    return aroma;
  }

  create(dto: CreateAromaDto) {
    return this.prisma.aroma.create({ data: dto });
  }

  async update(id: number, dto: UpdateAromaDto) {
    await this.findOne(id);
    try {
      return await this.prisma.aroma.update({ where: { id }, data: dto });
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ConflictException('Ya existe un aroma con ese nombre');
      }
      throw e;
    }
  }
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.aroma.delete({ where: { id } });
  }
}
