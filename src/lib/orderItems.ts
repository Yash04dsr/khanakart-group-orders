import { MENU_ITEMS } from "@/services/mockData";

const CUSTOM_ITEM_PREFIX = "custom:";

export const createCustomItemId = (name: string) =>
  `${CUSTOM_ITEM_PREFIX}${encodeURIComponent(name.trim())}`;

export const getItemDisplayName = (itemId: string) => {
  if (itemId.startsWith(CUSTOM_ITEM_PREFIX)) {
    try {
      return decodeURIComponent(itemId.slice(CUSTOM_ITEM_PREFIX.length));
    } catch {
      return itemId.slice(CUSTOM_ITEM_PREFIX.length);
    }
  }

  return MENU_ITEMS.find((item) => item.id === itemId)?.name ?? itemId;
};
