import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseStrategy } from './supabase.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule],
  providers: [SupabaseStrategy, AuthService],
  controllers: [AuthController],
  exports: [SupabaseStrategy],
})
export class AuthModule {}
