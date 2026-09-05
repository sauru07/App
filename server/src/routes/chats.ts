import { Router } from "express";
import { query } from "../db";
import { requireAuth } from "../middleware";
import { randomUUID } from "crypto";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const r = await query(
    `SELECT c.*, cm.role, cm.muted_until, cm.pinned, cm.archived
     FROM chats c JOIN chat_members cm ON cm.chat_id=c.id
     WHERE cm.user_id=$1 ORDER BY c.updated_at DESC`,
    [req.userId]
  );
  res.json(r.rows);
});

router.post("/", async (req, res) => {
  const { type="DIRECT", name=null, memberIds=[] } = req.body ?? {};
  const id = randomUUID();
  await query("BEGIN");
  try {
    await query(`INSERT INTO chats(id,type,name,created_by) VALUES($1,$2,$3,$4)`, [id,type,name,req.userId]);
    const ids = Array.from(new Set([req.userId, ...memberIds]));
    for (const userId of ids) await query(`INSERT INTO chat_members(chat_id,user_id,role) VALUES($1,$2,$3)`, [id,userId,userId===req.userId?"OWNER":"MEMBER"]);
    await query("COMMIT");
    res.status(201).json({ id });
  } catch (e) {
    await query("ROLLBACK"); throw e;
  }
});

router.get("/:chatId/messages", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 50), 100);
  const before = req.query.before ? String(req.query.before) : null;
  const r = await query(
    `SELECT m.* FROM messages m
     JOIN chat_members cm ON cm.chat_id=m.chat_id AND cm.user_id=$2
     WHERE m.chat_id=$1 AND ($3::timestamptz IS NULL OR m.created_at < $3)
     ORDER BY m.created_at DESC LIMIT $4`,
    [req.params.chatId, req.userId, before, limit]
  );
  res.json(r.rows.reverse());
});

router.post("/:chatId/messages", async (req, res) => {
  const { ciphertext, messageType="TEXT", clientMessageId, replyToMessageId, expiresAt } = req.body ?? {};
  if (!ciphertext) return res.status(400).json({ error: "ciphertext required" });
  const r = await query(
    `INSERT INTO messages(id,chat_id,sender_user_id,ciphertext,message_type,client_message_id,reply_to_message_id,expires_at)
     SELECT gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7
     WHERE EXISTS (SELECT 1 FROM chat_members WHERE chat_id=$1 AND user_id=$2)
     RETURNING *`,
    [req.params.chatId, req.userId, ciphertext, messageType, clientMessageId ?? null, replyToMessageId ?? null, expiresAt ?? null]
  );
  if (!r.rows[0]) return res.status(403).json({ error: "Not a member" });
  await query(`UPDATE chats SET updated_at=now() WHERE id=$1`, [req.params.chatId]);
  res.status(201).json(r.rows[0]);
});

export default router;
