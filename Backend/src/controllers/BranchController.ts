import { Response } from 'express';
import { AppDataSource } from '../database/data-source';
import { Branch } from '../entities/Branch';
import { SportBranch } from '../entities/SportBranch';
import { AuthenticatedRequest } from '../middleware/authorizePrivilege';
import { AuditLogService } from '../services/AuditLogService';

const auditLogService = new AuditLogService();

export class BranchController {
  private static branchRepo = AppDataSource.getRepository(Branch);
  private static sportBranchRepo = AppDataSource.getRepository(SportBranch);

  // ─── Audit helper ──────────────────────────────────────────────────────────

  private static async logAction(
    req: AuthenticatedRequest,
    action: string,
    description: string,
    oldValue?: any,
    newValue?: any,
  ) {
    try {
      if (!req.user?.staff_id) return;
      const staffRepo = AppDataSource.getRepository('Staff');
      const staff = (await staffRepo.findOne({
        where: { id: req.user.staff_id },
        relations: ['staff_type'],
      })) as any;
      const userName = staff
        ? `${staff.first_name_en} ${staff.last_name_en}`
        : req.user.email;
      const role = staff?.staff_type?.name_en || req.user.role;
      await auditLogService.createLog({
        userName,
        role,
        action,
        module: 'Branches',
        description,
        status: 'نجح',
        oldValue,
        newValue,
        dateTime: new Date(),
        ipAddress: req.ip || '0.0.0.0',
      });
    } catch (error) {
      console.error('BranchController audit log error:', error);
    }
  }

  // ─── GET /api/branches ────────────────────────────────────────────────────

  static async getAllBranches(req: AuthenticatedRequest, res: Response) {
    try {
      // Fetch all branches and enrich with a sports_count
      const branches = await BranchController.branchRepo.find({
        order: { created_at: 'DESC' },
      });

      // Count sports per branch via a single query for efficiency
      const counts: { branch_id: string; cnt: string }[] =
        await BranchController.sportBranchRepo.query(
          `SELECT branch_id::text, COUNT(*)::text as cnt FROM sport_branches GROUP BY branch_id`,
        );
      const countMap: Record<number, number> = {};
      for (const row of counts) {
        countMap[Number(row.branch_id)] = Number(row.cnt);
      }

      const data = branches.map((b) => ({
        ...b,
        sports_count: countMap[b.id] ?? 0,
      }));

      return res.json({ success: true, data, count: data.length });
    } catch (error: unknown) {
      console.error('BranchController.getAllBranches error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch branches',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── GET /api/branches/:id ────────────────────────────────────────────────

  static async getBranchById(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: 'Invalid branch ID' });

      const branch = await BranchController.branchRepo.findOne({ where: { id } });
      if (!branch)
        return res.status(404).json({ success: false, message: 'Branch not found' });

      return res.json({ success: true, data: branch });
    } catch (error: unknown) {
      console.error('BranchController.getBranchById error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch branch',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── POST /api/branches ───────────────────────────────────────────────────

  static async createBranch(req: AuthenticatedRequest, res: Response) {
    try {
      const { code, name_en, name_ar, location_en, location_ar, phone } = req.body;

      if (!code || !name_ar) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: code, name_ar',
        });
      }

      const existing = await BranchController.branchRepo.findOne({ where: { code } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'A branch with this code already exists',
        });
      }

      const branch = new Branch();
      branch.code = code;
      branch.name_ar = name_ar;
      branch.name_en = name_en || '';
      branch.location_ar = location_ar || null!;
      branch.location_en = location_en || null!;
      branch.phone = phone || null!;

      const saved = await BranchController.branchRepo.save(branch);
      await BranchController.logAction(req, 'Create', `Created branch: ${saved.name_ar}`, null, saved);

      return res.status(201).json({ success: true, message: 'Branch created successfully', data: saved });
    } catch (error: unknown) {
      console.error('BranchController.createBranch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create branch',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── PUT /api/branches/:id ────────────────────────────────────────────────

  static async updateBranch(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: 'Invalid branch ID' });

      const branch = await BranchController.branchRepo.findOne({ where: { id } });
      if (!branch)
        return res.status(404).json({ success: false, message: 'Branch not found' });

      const { code, name_en, name_ar, location_en, location_ar, phone } = req.body;

      // Unique code check (if changing code)
      if (code && code !== branch.code) {
        const conflict = await BranchController.branchRepo.findOne({ where: { code } });
        if (conflict)
          return res.status(409).json({ success: false, message: 'A branch with this code already exists' });
      }

      const old = { ...branch };
      if (code) branch.code = code;
      if (name_ar) branch.name_ar = name_ar;
      if (name_en !== undefined) branch.name_en = name_en;
      if (location_ar !== undefined) branch.location_ar = location_ar;
      if (location_en !== undefined) branch.location_en = location_en;
      if (phone !== undefined) branch.phone = phone;

      const updated = await BranchController.branchRepo.save(branch);
      await BranchController.logAction(req, 'Update', `Updated branch: ${updated.name_ar}`, old, updated);

      return res.json({ success: true, message: 'Branch updated successfully', data: updated });
    } catch (error: unknown) {
      console.error('BranchController.updateBranch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update branch',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── DELETE /api/branches/:id ─────────────────────────────────────────────

  static async deleteBranch(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: 'Invalid branch ID' });

      const branch = await BranchController.branchRepo.findOne({ where: { id } });
      if (!branch)
        return res.status(404).json({ success: false, message: 'Branch not found' });

      // Check for linked sports
      const sportCount = await BranchController.sportBranchRepo.count({
        where: { branch_id: id },
      });
      if (sportCount > 0) {
        return res.status(409).json({
          success: false,
          message: `Cannot delete branch. It has ${sportCount} linked sport(s). Remove all sport links first.`,
        });
      }

      await BranchController.branchRepo.remove(branch);
      await BranchController.logAction(req, 'Delete', `Deleted branch: ${branch.name_ar}`, branch, null);

      return res.json({ success: true, message: 'Branch deleted successfully' });
    } catch (error: unknown) {
      console.error('BranchController.deleteBranch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete branch',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── POST /api/branches/:branchId/assign-to-member/:memberId ─────────────

  static async assignBranchToMember(req: AuthenticatedRequest, res: Response) {
    try {
      const branchId = parseInt(req.params.branchId);
      const memberId = parseInt(req.params.memberId);

      if (isNaN(branchId) || isNaN(memberId))
        return res.status(400).json({ success: false, message: 'Invalid branch or member ID' });

      const branch = await BranchController.branchRepo.findOne({ where: { id: branchId } });
      if (!branch)
        return res.status(404).json({ success: false, message: 'Branch not found' });

      // Update member's branch_id — members table has a branch_id column
      const memberRepo = AppDataSource.getRepository('Member');
      const member = (await memberRepo.findOne({ where: { id: memberId } })) as any;
      if (!member)
        return res.status(404).json({ success: false, message: 'Member not found' });

      member.branch_id = branchId;
      await memberRepo.save(member);

      await BranchController.logAction(
        req,
        'Assign Branch',
        `Assigned branch "${branch.name_ar}" to member ID: ${memberId}`,
        null,
        { member_id: memberId, branch_id: branchId },
      );

      return res.json({
        success: true,
        message: 'Branch assigned to member successfully',
        data: { member_id: memberId, branch_id: branchId, branch_name: branch.name_ar },
      });
    } catch (error: unknown) {
      console.error('BranchController.assignBranchToMember error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to assign branch to member',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── GET /api/branches/:branchId/sports ──────────────────────────────────

  static async getBranchSports(req: AuthenticatedRequest, res: Response) {
    try {
      const branchId = parseInt(req.params.branchId);
      if (isNaN(branchId))
        return res.status(400).json({ success: false, message: 'Invalid branch ID' });

      const links = await BranchController.sportBranchRepo.find({
        where: { branch_id: branchId },
        relations: ['sport'],
        order: { created_at: 'ASC' },
      });

      return res.json({ success: true, data: links });
    } catch (error: unknown) {
      console.error('BranchController.getBranchSports error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch branch sports',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── POST /api/branch-sports ──────────────────────────────────────────────
  // Body: { branchId, sportId }

  static async addSportToBranch(req: AuthenticatedRequest, res: Response) {
    try {
      const { branchId, sportId } = req.body;
      const bId = parseInt(String(branchId));
      const sId = parseInt(String(sportId));

      if (isNaN(bId) || isNaN(sId))
        return res.status(400).json({ success: false, message: 'Invalid branchId or sportId' });

      // Check not already linked
      const existing = await BranchController.sportBranchRepo.findOne({
        where: { branch_id: bId, sport_id: sId },
      });
      if (existing)
        return res.status(409).json({ success: false, message: 'Sport is already linked to this branch' });

      const staffId = req.user?.staff_id;
      if (!staffId)
        return res.status(401).json({ success: false, message: 'Staff ID not found in token' });

      const link = new SportBranch();
      link.branch_id = bId;
      link.sport_id = sId;
      link.created_by_staff_id = staffId;
      link.status = 'active';

      const saved = await BranchController.sportBranchRepo.save(link);

      // Reload with the sport relation for the response
      const withRelation = await BranchController.sportBranchRepo.findOne({
        where: { id: saved.id },
        relations: ['sport'],
      });

      await BranchController.logAction(
        req,
        'Add Sport to Branch',
        `Linked sport ID ${sId} to branch ID ${bId}`,
        null,
        saved,
      );

      return res.status(201).json({ success: true, message: 'Sport linked to branch successfully', data: withRelation });
    } catch (error: unknown) {
      console.error('BranchController.addSportToBranch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to link sport to branch',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── PUT /api/branch-sports/:id ───────────────────────────────────────────
  // Body: { status }

  static async updateBranchSport(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: 'Invalid branch-sport link ID' });

      const link = await BranchController.sportBranchRepo.findOne({ where: { id } });
      if (!link)
        return res.status(404).json({ success: false, message: 'Branch-Sport link not found' });

      const { status } = req.body;
      const validStatuses = ['active', 'inactive', 'archived', 'pending'];
      if (status && !validStatuses.includes(status))
        return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });

      const old = { ...link };
      if (status) link.status = status;

      const updated = await BranchController.sportBranchRepo.save(link);
      await BranchController.logAction(
        req,
        'Update Branch-Sport',
        `Updated branch-sport link ID ${id}: status → ${status}`,
        old,
        updated,
      );

      return res.json({ success: true, message: 'Branch-sport link updated', data: updated });
    } catch (error: unknown) {
      console.error('BranchController.updateBranchSport error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update branch-sport link',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ─── DELETE /api/branch-sports/:id ───────────────────────────────────────

  static async removeSportFromBranch(req: AuthenticatedRequest, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: 'Invalid branch-sport link ID' });

      const link = await BranchController.sportBranchRepo.findOne({ where: { id } });
      if (!link)
        return res.status(404).json({ success: false, message: 'Branch-Sport link not found' });

      await BranchController.sportBranchRepo.remove(link);
      await BranchController.logAction(
        req,
        'Remove Sport from Branch',
        `Removed sport ID ${link.sport_id} from branch ID ${link.branch_id}`,
        link,
        null,
      );

      return res.json({ success: true, message: 'Sport removed from branch successfully' });
    } catch (error: unknown) {
      console.error('BranchController.removeSportFromBranch error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove sport from branch',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export default BranchController;
