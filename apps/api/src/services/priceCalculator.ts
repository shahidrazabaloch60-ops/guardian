export function getAccountTypeMultiplier(type: string): number {
  const multipliers: Record<string, number> = {
    REGULAR: 1.0,
    IRONMAN: 1.2,
    HARDCORE_IRONMAN: 1.5,
    ULTIMATE_IRONMAN: 1.8,
    GROUP_IRONMAN: 1.3,
    FRESH_START: 1.1,
  };
  return multipliers[type] || 1.0;
}

export function calculateOrderPrice(params: {
  serviceType: 'SKILL' | 'BOSS' | 'QUEST' | 'MINIGAME';
  basePrice: number;
  currentLevel?: number;
  targetLevel?: number;
  bossKillCount?: number;
  minigamePoints?: number; // Hours wanted
  accountType: string;
  expressPriority: boolean;
}): number {
  let price = 0;

  switch (params.serviceType) {
    case 'SKILL':
      if (params.currentLevel && params.targetLevel) {
        const diff = Math.max(0, params.targetLevel - params.currentLevel);
        price = diff * params.basePrice;
      }
      break;

    case 'BOSS':
      if (params.bossKillCount) {
        price = params.bossKillCount * params.basePrice;
      }
      break;

    case 'MINIGAME':
      if (params.minigamePoints) {
        price = params.minigamePoints * params.basePrice; // Points acts as hours here
      }
      break;

    case 'QUEST':
      price = params.basePrice;
      break;
  }

  // Account Type Multipliers
  price *= getAccountTypeMultiplier(params.accountType);

  // Express Delivery Priority (+20%)
  if (params.expressPriority) {
    price += price * 0.2;
  }

  return parseFloat(price.toFixed(2));
}

export function applyCoupon(price: number, coupon: any): { discount: number; finalPrice: number } {
  let discount = 0;
  if (coupon.type === 'PERCENTAGE') {
    discount = price * (coupon.value / 100);
  } else {
    // FIXED
    discount = coupon.value;
  }
  
  // Ensure discount doesn't exceed price
  discount = Math.min(discount, price);
  
  return {
    discount: parseFloat(discount.toFixed(2)),
    finalPrice: parseFloat((price - discount).toFixed(2)),
  };
}
