import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';


const INCLUDE_RELATIONS = {
  department: { select: { id: true, name: true } },
  role: { select: { id: true, name: true } },
} satisfies Prisma.EmployeeInclude;



@Injectable()
export class EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(args: Omit<Prisma.EmployeeFindManyArgs, 'include'>) {
    return this.prisma.employee.findMany({ ...args, include: INCLUDE_RELATIONS });
  }

  count(where: Prisma.EmployeeWhereInput) {
    return this.prisma.employee.count({ where });
  }

  findById(id: string) {
    return this.prisma.employee.findFirst({ where: { id, deletedAt: null } });
  }

  create(data: Prisma.EmployeeUncheckedCreateInput) {
    return this.prisma.employee.create({ data, include: INCLUDE_RELATIONS });
  }

  update(id: string, data: Prisma.EmployeeUncheckedUpdateInput) {
    return this.prisma.employee.update({
      where: { id },
      data,
      include: INCLUDE_RELATIONS,
    });
  }

  softDelete(id: string) {
    return this.prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /** True when an active department with this id exists. */
  async departmentExists(id: string): Promise<boolean> {
    const count = await this.prisma.department.count({ where: { id, deletedAt: null } });
    return count > 0;
  }

  /** True when an active (non-deleted) role with this id exists. */
  async roleExists(id: string): Promise<boolean> {
    const count = await this.prisma.role.count({ where: { id, deletedAt: null } });
    return count > 0;
  }

  async findByEmail(email: string) {
    return this.prisma.employee.findUnique({ where: { email } });
  }
}
