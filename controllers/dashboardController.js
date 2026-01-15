const prisma = require("../server/prisma");

async function summary(req, res) {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    let merchantsTotal = 0;
    let merchantsActive = 0;
    let merchantsPaid = 0;
    let vendorsTotal = 0;
    let vendorsActive = 0;
    let usersTotal = 0;
    let usersActive = 0;
    let usersLast7Days = 0;
    let countriesTotal = 0;
    let countriesActive = 0;

    if (req.auth.userType === "ADMIN") {
      [
        merchantsTotal,
        merchantsActive,
        merchantsPaid,
        vendorsTotal,
        vendorsActive,
        usersTotal,
        usersActive,
        usersLast7Days,
        countriesTotal,
        countriesActive,
      ] = await Promise.all([
        prisma.merchant.count(),
        prisma.merchant.count({ where: { isActive: true } }),
        prisma.merchant.count({
          where: { plan: { in: ["PRO", "ENTERPRISE"] } },
        }),
        prisma.vendor.count(),
        prisma.vendor.count({ where: { isActive: true } }),
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.country.count(),
        prisma.country.count({ where: { isActive: true } }),
      ]);
    } else if (req.auth.userType === "MERCHANT") {
      [
        merchantsTotal,
        merchantsActive,
        merchantsPaid,
        vendorsTotal,
        vendorsActive,
        usersTotal,
        usersActive,
        usersLast7Days,
        countriesTotal,
        countriesActive,
      ] = await Promise.all([
        prisma.merchant.count({ where: { id: req.auth.merchantId } }),
        prisma.merchant.count({
          where: { id: req.auth.merchantId, isActive: true },
        }),
        prisma.merchant.count({
          where: {
            id: req.auth.merchantId,
            plan: { in: ["PRO", "ENTERPRISE"] },
          },
        }),
        prisma.vendor.count({ where: { merchantId: req.auth.merchantId } }),
        prisma.vendor.count({
          where: { merchantId: req.auth.merchantId, isActive: true },
        }),
        prisma.user.count({ where: { merchantId: req.auth.merchantId } }),
        prisma.user.count({
          where: { merchantId: req.auth.merchantId, isActive: true },
        }),
        prisma.user.count({
          where: {
            merchantId: req.auth.merchantId,
            createdAt: { gte: weekAgo },
          },
        }),
        prisma.country.count(),
        prisma.country.count({ where: { isActive: true } }),
      ]);
    } else if (req.auth.userType === "VENDOR" && req.auth.vendorId) {
      [
        vendorsTotal,
        vendorsActive,
        usersTotal,
        usersActive,
        usersLast7Days,
        countriesTotal,
        countriesActive,
      ] = await Promise.all([
        prisma.vendor.count({ where: { id: req.auth.vendorId } }),
        prisma.vendor.count({ where: { id: req.auth.vendorId, isActive: true } }),
        prisma.user.count({ where: { vendorId: req.auth.vendorId } }),
        prisma.user.count({
          where: { vendorId: req.auth.vendorId, isActive: true },
        }),
        prisma.user.count({
          where: { vendorId: req.auth.vendorId, createdAt: { gte: weekAgo } },
        }),
        prisma.country.count(),
        prisma.country.count({ where: { isActive: true } }),
      ]);
    }

    const paidPercent = merchantsTotal
      ? Math.round((merchantsPaid / merchantsTotal) * 100)
      : 0;

    res.json({
      data: {
        merchants: {
          total: merchantsTotal,
          active: merchantsActive,
          paid: merchantsPaid,
          paidPercent,
        },
        vendors: {
          total: vendorsTotal,
          active: vendorsActive,
        },
        users: {
          total: usersTotal,
          active: usersActive,
          last7Days: usersLast7Days,
        },
        countries: {
          total: countriesTotal,
          active: countriesActive,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: "database error" });
  }
}

module.exports = {
  summary,
};
