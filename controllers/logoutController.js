export default function logoutAdmin(req, res) {
  res.clearCookie("adminAccessCookie", { path: "/", secure: true, sameSite: "Strict" });
  res.clearCookie("adminRefreshCookie", { path: "/", secure: true, sameSite: "Strict" });
  res.status(200).json({ message: "You have been logged out successfully" });
}
