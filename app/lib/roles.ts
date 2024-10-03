export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    BETA_USER = 'beta_user',
    MEMBER_TIER_1 = 'member_tier_1',
    MEMBER_TIER_2 = 'member_tier_2',
  }
  
  export function isAuthorized(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = [
      UserRole.MEMBER_TIER_1,
      UserRole.MEMBER_TIER_2,
      UserRole.BETA_USER,
      UserRole.SUPER_ADMIN,
    ];
  
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
  
    return userRoleIndex >= requiredRoleIndex;
  }