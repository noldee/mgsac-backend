import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  private supabase;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super();
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL') as string,
      config.get<string>('SUPABASE_SERVICE_KEY') as string,
    );
  }

  async validate(request: any) {
    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException();

    const token = authHeader.replace('Bearer ', '');

    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) throw new UnauthorizedException();

    const user = await this.prisma.user.findUnique({
      where: { id: data.user.id },
    });

    if (!user) throw new UnauthorizedException('Usuario no registrado');

    return user;
  }
}