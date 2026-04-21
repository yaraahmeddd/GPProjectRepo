import { Router } from 'express';
import BranchController from '../controllers/BranchController';
import { authorizePrivilege, AuthenticatedRequest } from '../middleware/authorizePrivilege';

const router = Router();

// ── Branch CRUD ──────────────────────────────────────────────────────────────

/**
 * GET /api/branches
 * List all branches (with sports_count).
 * @requires VIEW_BRANCHES
 */
router.get('/', authorizePrivilege('VIEW_BRANCHES'), (req, res) =>
  BranchController.getAllBranches(req as AuthenticatedRequest, res),
);

/**
 * GET /api/branches/:id
 * Get a single branch.
 * @requires VIEW_BRANCHES
 */
router.get('/:id', authorizePrivilege('VIEW_BRANCHES'), (req, res) =>
  BranchController.getBranchById(req as AuthenticatedRequest, res),
);

/**
 * POST /api/branches
 * Create a new branch.
 * @requires CREATE_BRANCH
 * @body { code, name_ar, name_en?, location_ar?, location_en?, phone? }
 */
router.post('/', authorizePrivilege('CREATE_BRANCH'), (req, res) =>
  BranchController.createBranch(req as AuthenticatedRequest, res),
);

/**
 * PUT /api/branches/:id
 * Update an existing branch.
 * @requires UPDATE_BRANCH
 */
router.put('/:id', authorizePrivilege('UPDATE_BRANCH'), (req, res) =>
  BranchController.updateBranch(req as AuthenticatedRequest, res),
);

/**
 * DELETE /api/branches/:id
 * Delete a branch (blocked if it has linked sports).
 * @requires DELETE_BRANCH
 */
router.delete('/:id', authorizePrivilege('DELETE_BRANCH'), (req, res) =>
  BranchController.deleteBranch(req as AuthenticatedRequest, res),
);

/**
 * POST /api/branches/:branchId/assign-to-member/:memberId
 * Assign a branch to a member.
 * @requires ASSIGN_BRANCH_TO_MEMBER
 */
router.post(
  '/:branchId/assign-to-member/:memberId',
  authorizePrivilege('ASSIGN_BRANCH_TO_MEMBER'),
  (req, res) => BranchController.assignBranchToMember(req as AuthenticatedRequest, res),
);

/**
 * GET /api/branches/:branchId/sports
 * Get all sports linked to a branch (public — no auth needed per spec).
 */
router.get('/:branchId/sports', (req, res) =>
  BranchController.getBranchSports(req as AuthenticatedRequest, res),
);

export default router;
