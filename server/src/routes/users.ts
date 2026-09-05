import { Router } from "express";
import { query } from "../db";
import { requireAuth } from "../middleware";

const router = Router();
router.use(requireAuth);

router.get("/me", async (req, res) => {
  const r = await query(`SELECT id, username, display_name, bio, avatar_url, phone_verified, created_at, updated_at FROM users WHERE id=$1`, [req.userId]);
  res.json(r.rows[0] ?? null);
});

router.patch("/me", async (req, res) => {
  const { username, displayName, bio } = req.body ?? {};
  const r = await query(
    `UPDATE users SET username=COALESCE($2,username), display_name=COALESCE($3,display_name), bio=COALESCE($4,bio), updated_at=now()
     WHERE id=$1 RETURNING id, username, display_name, bio, avatar_url`,
    [req.userId, username, displayName, bio]
  );
  res.json(r.rows[0]);
});

router.get("/me/privacy", async (req, res) => {
  const r = await query(`SELECT * FROM user_privacy WHERE user_id=$1`, [req.userId]);
  res.json(r.rows[0]);
});

router.patch("/me/privacy", async (req, res) => {
  const { lastSeenVisibility, profilePhotoVisibility, readReceipts, typingIndicators, groupAddPermission, callsPermission } = req.body ?? {};
  const r = await query(
    `UPDATE user_privacy SET
      last_seen_visibility=COALESCE($2,last_seen_visibility),
      profile_photo_visibility=COALESCE($3,profile_photo_visibility),
      read_receipts=COALESCE($4,read_receipts),
      typing_indicators=COALESCE($5,typing_indicators),
      group_add_permission=COALESCE($6,group_add_permission),
      calls_permission=COALESCE($7,calls_permission)
     WHERE user_id=$1 RETURNING *`,
    [req.userId,lastSeenVisibility,profilePhotoVisibility,readReceipts,typingIndicators,groupAddPermission,callsPermission]
  );
  res.json(r.rows[0]);
});

export default router;
