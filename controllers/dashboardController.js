const prisma = require("../server/prisma");

async function summary(req, res) {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
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
