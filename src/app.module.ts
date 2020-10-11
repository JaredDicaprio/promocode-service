import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromocodesModule } from './promocodes/promocodes.module';

@Module({
  imports: [ConfigModule.forRoot(), PromocodesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
