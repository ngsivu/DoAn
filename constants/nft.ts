export const NFT_DECIMAL_SCALE = 8;
export const NFT_PREFIX_CODE = '#';
export const MAX_LENGTH_PRICE = 12;
export const MIN_VALUE_TOTAL_COPIES = 1;
export const NFT_PERCENTAGE_SUFFIX = '%';
export const MAX_LENGTH_TOTAL_SUPPLY = 7;
export const NFT_DECIMAL_SCALE_PRICE = 18;
export const NFT_OVERVIEW_DECIMAL_SCALE = 2;
export const MAX_VALUE_TOTAL_COPIES = 1000000;

export const NFT_STANDARD = [
  { value: 'erc-721', key: 0, label: 'common.txt_erc_721' },
  { value: 'erc-1155', key: 1, label: 'common.txt_erc_1155' },
];

export const NFT_TRANSACTION_STATUS = {
  DRAFT: 'draft',
  SUCCESS: 'success',
  CANCEL: 'cancel',
  FAILED: 'failed',
};

export const ACTIVITIES_TYPE = [
  { value: 'erc-721', label: 'common.txt_hero' },
  { value: 'erc-1155', label: 'common.txt_item' },
];

export const NFT_TABS = {
  HERO: {
    key: 'HERO',
    label: 'home.txt_heroes',
    type: 'Hero',
    query: 'hero',
  },
  ITEM: {
    key: 'ITEM',
    label: 'home.txt_items',
    type: 'Item',
    query: 'item',
  },
};

export const SERVER_PARAMS_CONFIG = {
  ATTRIBUTES: 'attributes',
};

export const NFT_MEDIA = {
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  MODEL: '3d',
};

export const NFT_MIME_TYPE = ['image/gif'];

export const BUY_STEPS = {
  START: 0,
  PROCESSING: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const LIST_FOR_SALE_STEPS = {
  START: 0,
  PROCESSING: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const REMOVE_FROM_SALE_STEPS = {
  START: 0,
  PROCESSING: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const ANTD_ORDERS = {
  ASCEND: 'ascend',
  DESCEND: 'descend',
};

export const ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
  FIELD: 'field',
  ORDER: 'order',
};
