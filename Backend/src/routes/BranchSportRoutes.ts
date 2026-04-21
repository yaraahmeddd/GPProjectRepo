import { Router } from 'express';
import BranchController from '../controllers/BranchController';
import { authorizePrivilege, AuthenticatedRequest } from '../middleware/authorizePrivilege';

const router = Router();

/**
 * POST /api/branch-sports
 * Link a sport to a branch.
 * @requires CREATE_BRANCH
 * @body { branchId, sportId }
 */
router.post('/', authorizePrivilege('CREATE_BRANCH'), (req, res) =>
  BranchController.addSportToBranch(req as AuthenticatedRequest, res),
);

/**
 * PUT /api/branch-sports/:id
 * Update the status of a branch-sport link.
 * @requires UPDATE_BRANCH
 * @body { status: 'active' | 'inactive' | 'archived' | 'pending' }
 */
router.put('/:id', authorizePrivilege('UPDATE_BRANCH'), (req, res) =>
  BranchController.updateBranchSport(req as AuthenticatedRequest, res),
);

/**
 * DELETE /api/branch-sports/:id
 * Remove a sport from a branch.
 * @requires DELETE_BRANCH
 */
router.delete('/:id', authorizePrivilege('DELETE_BRANCH'), (req, res) =>
  BranchController.removeSportFromBranch(req as AuthenticatedRequest, res),
);

export default router;
