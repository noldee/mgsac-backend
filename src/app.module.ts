import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { LineasModule } from './lineas/lineas.module';
import { AromasModule } from './aromas/aromas.module';
import { FormatosModule } from './formatos/formatos.module';
import { StorageModule } from './storage/storage.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    LineasModule,
    AromasModule,
    FormatosModule,
    StorageModule,
    StatsModule
  ],
})
export class AppModule {}