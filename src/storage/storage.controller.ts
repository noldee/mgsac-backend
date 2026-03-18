import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('storage')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    return this.storageService.uploadImage(file);
  }

  @Delete('delete')
  delete(@Body() body: { url: string }) {
    return this.storageService.deleteImage(body.url);
  }
}
