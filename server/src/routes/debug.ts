import { Router } from "express";
import { getPrisma } from "../db/prisma";

const router = Router();

router.get("/db-smoke", async (req, res, next) => {
  try {
    const prisma = getPrisma();

    const userCount = await prisma.user.count();

    res.json({
      ok: true,
      count: userCount,
    });
  } catch (error) {
    next(error);
  }
});

export default router;