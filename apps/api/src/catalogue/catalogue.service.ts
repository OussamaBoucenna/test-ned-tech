export interface CatalogueItem {
  id: string;
  name: string;
}

/**
 * Minimal slice of a Prisma model delegate that this service needs.
 * Both `prisma.department` and `prisma.role` satisfy it, so one implementation
 * powers both resources (DRY — see departments/roles modules).
 */
export interface CatalogueDelegate {
  findMany(args: unknown): Promise<CatalogueItem[]>;
}

/**
 * Read-only access to a "catalogue" resource — a uniquely-named lookup table
 * (Department, Role). Only listing is exposed: these power the front-end's
 * select dropdowns; they are seeded, not managed through the API.
 */
export abstract class CatalogueService {
  protected constructor(private readonly delegate: CatalogueDelegate) {}

  /** Active items only (not soft-deleted), alphabetical. */
  findAll(): Promise<CatalogueItem[]> {
    return this.delegate.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }
}
