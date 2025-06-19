import { Request, Response, NextFunction } from "express";
import QRCode from "qrcode";
import redisClient from "../config/redisclient";
import {
  createQRCode,
  incrementScanCount,
  findUserQRCodes,
  deleteQRCodeById,
} from "../repositories/qrRepository";

export const generateQRCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Missing 'data' in request body",
      });
    }

    const userId = req.user?.id ?? null;

    let cacheKey: string | null = null;
    if (userId) {
      cacheKey = `qr:${userId}:${data}`;
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.status(200).json({
          success: true,
          qr: JSON.parse(cached),
          cached: true,
        });
      }
    }

    const imageUrl = await QRCode.toDataURL(data);
    const qrRecord = await createQRCode(data, imageUrl, userId);

    if (cacheKey) {
      await redisClient.set(cacheKey, JSON.stringify(qrRecord));
    }
    return res.status(201).json({
      success: true,
      qr: qrRecord,
      cached: false,
    });
  } catch (err) {
    next(err);
  }
};

export const trackQRCodeScanController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const updatedQR = await incrementScanCount(id);

    if (!updatedQR) {
      return res
        .status(404)
        .json({ success: false, message: "QR Code not found" });
    }

    if (updatedQR.user_id) {
      const cacheKey = `qr:${updatedQR.user_id}:${updatedQR.data}`;
      await redisClient.set(cacheKey, JSON.stringify(updatedQR));
    }

    return res.json({
      success: true,
      qrCode: updatedQR,
    });
  } catch (err) {
    next(err);
  }
};

export const getMyQRCodesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user.id;

    const qrCodes = await findUserQRCodes(userId);

    return res.json({ success: true, qrCodes });
  } catch (error) {
    next(error);
  }
};

export const deleteQRCodeController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deletedQR = await deleteQRCodeById(id, userId);

    if (!deletedQR) {
      return res
        .status(404)
        .json({ success: false, message: "QR Code not found or unauthorized" });
    }

    const cacheKey = `qr:${userId}:${deletedQR.data}`;
    await redisClient.del(cacheKey);

    return res.json({ success: true, message: "QR Code deleted" });
  } catch (error) {
    next(error);
  }
};