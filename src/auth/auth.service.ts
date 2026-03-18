import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private supabase;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL') as string,
      config.get<string>('SUPABASE_SERVICE_KEY') as string,
    );
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) throw new Error(error.message);

    await this.prisma.user.create({
      data: {
        id: data.user.id,
        email: data.user.email,
        role: 'USER',
      },
    });

    return { message: 'Usuario creado correctamente' };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    // ← Trae el role de Prisma
    const dbUser = await this.prisma.user.findUnique({
      where: { id: data.user.id },
    });

    return {
      access_token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        role: dbUser?.role ?? 'USER', // ← aquí está la clave
      },
    };
  }

  // en auth.service.ts
  async forgotPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password',
    });

    if (error) throw new Error(error.message);

    return { message: 'Email de recuperación enviado' };
  }

  async resetPassword(accessToken: string, newPassword: string) {
    const { error } = await this.supabase.auth.admin.updateUserById(
      (await this.supabase.auth.getUser(accessToken)).data.user!.id,
      { password: newPassword },
    );
    if (error) throw new Error(error.message);
    return { message: 'Contraseña actualizada correctamente' };
  }
}
