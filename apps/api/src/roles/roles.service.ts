import { Injectable } from '@nestjs/common';
import { CatalogueService } from '../catalogue/catalogue.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService extends CatalogueService {
  constructor(prisma: PrismaService) {
    super(prisma.role as never);
  }
}
