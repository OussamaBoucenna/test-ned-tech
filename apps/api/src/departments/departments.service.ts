import { Injectable } from '@nestjs/common';
import { CatalogueService } from '../catalogue/catalogue.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentsService extends CatalogueService {
  constructor(prisma: PrismaService) {
    super(prisma.department as never);
  }
}
