import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    // Loads the repo-root .env so a single file configures both apps.
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env', '.env'] }),
    PrismaModule,
    AuditLogModule,
    AuthModule,
    DepartmentsModule,
    RolesModule,
    EmployeesModule,
  ],
})
export class AppModule {}
