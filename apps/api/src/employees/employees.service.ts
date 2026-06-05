import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { QueryEmployeesDto } from './dto/query-employees.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.repository';

@Injectable()
export class EmployeesService {
  constructor(private readonly repository: EmployeesRepository) {}

  async findAll(query: QueryEmployeesDto) {
    const { page, limit, search, departmentId } = query;

    const where: Prisma.EmployeeWhereInput = {
      deletedAt: null,
      ...(departmentId ? { departmentId } : {}),
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } }, // Maj / Miniscule
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.repository.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.repository.count(where),
    ]);

    return {
      items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(dto: CreateEmployeeDto) {
    await this.assertEmailAvailable(dto.email);
    await this.assertReferencesExist(dto.departmentId, dto.roleId);
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    await this.getOrThrow(id);
    if (dto.email) {
      await this.assertEmailAvailable(dto.email, id);
    }
    await this.assertReferencesExist(dto.departmentId, dto.roleId);
    return this.repository.update(id, dto);
  }

  async remove(id: string) {
    await this.getOrThrow(id);
    await this.repository.softDelete(id);
  }

  private async getOrThrow(id: string) {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }
    return employee;
  }

   /** Validation  */




  private async assertEmailAvailable(email: string, ignoreId?: string) {
    const existing = await this.repository.findByEmail(email);
    if (existing && existing.id !== ignoreId) {
      throw new ConflictException(`Email ${email} is already in use`);
    }
  }

 
  private async assertReferencesExist(departmentId?: string, roleId?: string) {
    if (departmentId && !(await this.repository.departmentExists(departmentId))) {
      throw new BadRequestException(`Department ${departmentId} does not exist`);
    }
    if (roleId && !(await this.repository.roleExists(roleId))) {
      throw new BadRequestException(`Role ${roleId} does not exist`);
    }
  }
}
