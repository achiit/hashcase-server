import { z } from 'zod'

import { ChainType, ItemStatus, ItemType, Standard } from '../enums'

const WalletLoginSchema = z
  .object({
    body: z.object({
      signature: z.string(),
      address: z.string(),
      token: z.string()
    })
  })
  .passthrough()

const MagicLoginSchema = z
  .object({
    body: z.object({
      didToken: z.string()
    })
  })
  .passthrough()

const ParticleLoginSchema = z
  .object({
    body: z.object({
      address: z.string()
    })
  })
  .passthrough()
const CheckInSchema = z
  .object({
    query: z.object({
      user_id: z.string(),
      owner_id: z.string()
    })
  })
  .passthrough()
const OwnerLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
})

const OwnerSchema = z
  .object({
    body: z.object({
      owner: z.object({
        name: z.string().optional(),
        email: z.string().email(),
        password: z.string(),
        company_name: z.string().optional()
      })
    })
  })
  .passthrough()

const AdminEditOwnerSchema = OwnerSchema.extend({
  body: z.object({
    owner: z.object({
      id: z.number(),
      password: z.string().optional(),
      password_hash: z.string().optional()
    })
  })
}).passthrough()

const CollectionSchema = z
  .object({
    body: z.object({
      collection: z.object({
        name: z.string(),
        description: z.string().optional(),
        image_uri: z.string().optional(),
        chain_type: z.enum([ChainType.ETHEREUM, ChainType.FILECOIN]),
        chain_id: z.number(),
        contract_address: z.string(),
        standard: z.enum([Standard.ERC721, Standard.ERC1155]),
        paymaster_id: z.number().optional(),
        attributes: z.string().optional()
      })
    })
  })
  .passthrough()

const ItemSchema = z
  .object({
    body: z.object({
      item: z.object({
        name: z.string(),
        description: z.string().optional(),
        image_uri: z.string().optional(),
        collection_id: z.number(),
        token_id: z.number(),
        type: z
          .enum([
            ItemType.BUYANDCLAIM,
            ItemType.CLAIMANDSHIP,
            ItemType.TRANSFERNFT
          ])
          .optional(),
        status: z.enum([ItemStatus.ACTIVE, ItemStatus.INACTIVE]).optional(),
        attributes: z.string().optional()
      })
    })
  })
  .passthrough()

const EditCollectionSchema = z
  .object({
    body: z.object({
      collection: z.object({
        id: z.number()
      })
    })
  })
  .passthrough()

const EditItemSchema = z
  .object({
    body: z.object({
      item: z.object({
        id: z.number()
      })
    })
  })
  .passthrough()

const AdminCollectionSchema = CollectionSchema.extend({
  body: z.object({
    collection: z.object({
      owner_id: z.number(),
      priority: z.number().optional()
    })
  })
}).passthrough()

const AdminEditCollectionSchema = EditCollectionSchema.extend({
  body: z.object({
    collection: z.object({
      owner_id: z.number().optional(),
      priority: z.number().optional()
    })
  })
}).passthrough()

const ClaimNFTSchema = z
  .object({
    body: z.object({
      item_id: z.number(),
      amount: z.number().optional()
    })
  })
  .passthrough()

const MintNFTSchema = z
  .object({
    query: z.object({
      collection_id: z.string(),
      amount: z.string().optional()
    })
  })
  .passthrough()

const TransferNFTSchema = z
  .object({
    body: z.object({
      item_id: z.number(),
      amount: z.number().optional(),
      to: z.string()
    })
  })
  .passthrough()

const CollectionNameAndTokenId = z
  .object({
    query: z.object({
      collection_name: z.string(),
      token_id: z.string()
    })
  })
  .passthrough()

const RequireCollectionId = z
  .object({
    query: z.object({
      collection_id: z.string()
    })
  })
  .passthrough()

const RequireItemId = z
  .object({
    query: z.object({
      item_id: z.string()
    })
  })
  .passthrough()

const RequireBadgeId = z
  .object({
    query: z.object({
      badge_id: z.string()
    })
  })
  .passthrough()

const RequireOwnerID = z
  .object({
    query: z.object({
      owner_id: z.string()
    })
  })
  .passthrough()

const CheckItemAmountSchema = z
  .object({
    query: z.object({
      item_id: z.string(),
      amount: z.string()
    })
  })
  .passthrough()

const RequireLoyaltyCode = z
  .object({
    body: z.object({
      code: z.string()
    })
  })
  .passthrough()
const RequireBadgeCharacterString = z
  .object({
    body: z.object({
      badge_character_string: z.string()
    })
  })
  .passthrough()

const LoyaltySchema = z.object({
  body: z.object({
    loyalty: z.object({
      code: z.string(),
      value: z.number(),
      type: z.string().optional()
    })
  })
})
export const BadgeSchema = z
  .object({
    body: z.object({
      badge: z.object({
        title: z.string(),
        description: z.string(),
        image_url: z.string().url(),
        points: z.number().int().positive(),
        character_string: z.string()
      })
    })
  })
  .passthrough()
const EditLoyaltySchema = z
  .object({
    body: z.object({
      loyalty: z.object({
        code: z.string(),
        value: z.number().optional(),
        type: z.string().optional()
      })
    })
  })
  .passthrough()

const LoyaltyDataSchema = z.object({
  body: z.object({
    loyalty: z.string()
  })
})

export {
  WalletLoginSchema,
  MagicLoginSchema,
  OwnerLoginSchema,
  OwnerSchema,
  AdminEditOwnerSchema,
  CollectionSchema,
  ItemSchema,
  EditCollectionSchema,
  EditItemSchema,
  AdminCollectionSchema,
  AdminEditCollectionSchema,
  ClaimNFTSchema,
  TransferNFTSchema,
  RequireCollectionId,
  RequireItemId,
  RequireOwnerID,
  CheckItemAmountSchema,
  CollectionNameAndTokenId,
  MintNFTSchema,
  RequireLoyaltyCode,
  RequireBadgeCharacterString,
  RequireBadgeId,
  LoyaltySchema,
  EditLoyaltySchema,
  LoyaltyDataSchema,
  ParticleLoginSchema,
  CheckInSchema // Add this line to export your new schema
}
