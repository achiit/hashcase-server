enum ChainType {
  ETHEREUM = 'ethereum',
  FILECOIN = 'filecoin',
  FUEL = 'fuel'
}

enum Standard {
  ERC721 = 'erc721',
  ERC1155 = 'erc1155'
}

enum ItemType {
  BUYANDCLAIM = 'buyandclaim',
  CLAIMANDSHIP = 'claimandship',
  TRANSFERNFT = 'transfernft'
}

enum ItemStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

enum PaymasterType {
  BICONOMY = 'biconomy'
}

enum TokenType {
  USER = 'user',
  OWNER = 'owner',
  ADMIN = 'admin'
}

enum LoyaltyType {
  ONE_FIXED = 'ONE_FIXED',
  REPEAT_FIXED = 'FIXED',
  ONE_VARIABLE = 'ONE_VARIABLE',
  REPEAT_VARIABLE = 'VARIABLE',
  ADMIN_ADD = 'ADMIN_ADD',
  ADMIN_SUBTRACT = 'ADMIN_SUBTRACT',
  REFERRAL = 'REFERRAL',
  REDEEM = 'REDEEM'
}

export {
  ChainType,
  Standard,
  ItemType,
  ItemStatus,
  PaymasterType,
  TokenType,
  LoyaltyType
}
