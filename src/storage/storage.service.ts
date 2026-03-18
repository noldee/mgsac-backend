import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase;

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      config.get<string>('SUPABASE_URL') as string,
      config.get<string>('SUPABASE_SERVICE_KEY') as string,
    );
  }

  async uploadImage(file: Express.Multer.File, folder = 'products') {
    const fileName = `${folder}/${Date.now()}-${file.originalname}`;

    const { data, error } = await this.supabase.storage
      .from('products')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new Error(error.message);

    const { data: urlData } = this.supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl };
  }

  async deleteImage(url: string) {
    const path = url.split('/products/')[1];
    const { error } = await this.supabase.storage
      .from('products')
      .remove([`products/${path}`]);

    if (error) throw new Error(error.message);
    return { message: 'Imagen eliminada' };
  }
}
