export const profileTabIds = [
  'profile',
  'accounts',
  'notifications',
  'privacy',
  'security',
] as const;

export type ProfileTab = (typeof profileTabIds)[number];

export function getProfileTab(value: string | string[] | undefined): ProfileTab {
  const candidate = Array.isArray(value) ? value[0] : value;
  return profileTabIds.includes(candidate as ProfileTab) ? (candidate as ProfileTab) : 'profile';
}
