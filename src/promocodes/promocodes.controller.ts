import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Promocode } from './interfaces/promocode.interface';
import { PromocodesService } from './promocodes.service';

@Controller('promocodes')
export class PromocodesController {
  constructor(private readonly promocodeService: PromocodesService) {}

  @MessagePattern('generate')
  generate(data): Promise<Promocode[]> {
    const { evoucherId, qty } = data;
    return this.promocodeService.generatePromoCodes(evoucherId, qty);
  }
}
