export const userPermissions = {
  admin: ["read:docs", "read:users", "create:user", "create:docs", "edit:docs"],
  viewer: ["read:docs", "read:users"],
  user: ["chat:chat"],
};

export const roleBasedRoutes = {
  admin: [
    "/edit-doc",
    "/profile",
    "/roleInfo",
    "/search-docs",
    "/upload-documents",
    "/users-group",
  ],
  viewer: [
    "/edit-doc",
    "/profile",
    "/roleInfo",
    "/search-docs",
    "/upload-documents",
    "/users-group",
  ],
  user: ["/starter-chat", "/chat"],
};
