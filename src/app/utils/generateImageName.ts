export const generateUniqueImageName = (creatorId: string): string => {
  const timestamp = Date.now();
  return `${creatorId}_${timestamp}`;
};
