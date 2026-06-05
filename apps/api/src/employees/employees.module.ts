import { Module } from '@nestjs/common';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesRepository } from './employees.repository';

@Module({
  imports: [AuditLogModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository],
})
export class EmployeesModule {}
