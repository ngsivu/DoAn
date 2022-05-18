import moment from 'moment';
import BigNumber from 'bignumber.js';

import LENGTH_CONSTANTS from 'constants/length';
import { EMPTY_DEFAULT_TEXT, ZERO_VALUE } from 'constants/common';
import { ANTD_ORDERS, MAX_LENGTH_PRICE, ORDERS } from 'constants/nft';

declare let window: any;

const { MIN_VALUE } = LENGTH_CONSTANTS;

export const DATE_FORMAT = 'MMMM DD, YYYY  HH:mm:ss';

export const clearRequestParams = (params?: any) => {
  const newParams = {} as any;
  const cloneParams = { ...params };
  for (const field in cloneParams) {
    if (cloneParams?.[field] || cloneParams?.[field] === 0 || cloneParams?.[field] === false) {
      newParams[field] = cloneParams?.[field];
    }
  }
  return newParams;
};

export const formatDate = (date: moment.MomentInput | any, type = DATE_FORMAT) => {
  return date ? moment(date).format(type) : EMPTY_DEFAULT_TEXT;
};

export const getLocation = () => {
  return typeof window !== 'undefined' ? window.location.href : '';
};

export const shortenAddress = (address: string, number = -4) => {
  if (address) {
    const first = address.slice(0, 6);
    const last = address.slice(number);
    return `${first}...${last}`;
  }
  return;
};

export const formatCurrency = (value: any) => {
  if (!value) {
    return ZERO_VALUE;
  }
  return new BigNumber(value).isLessThan(new BigNumber(MIN_VALUE))
    ? new BigNumber(MIN_VALUE).toFormat()
    : new BigNumber(value).toFormat();
};

export const getNumberValue = (value?: number) => {
  return value ?? ZERO_VALUE;
};

export const convertPriceBigNumber = (value: any, coinDecimal = 18) => {
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });
  return new BigNumber(value).multipliedBy(new BigNumber(Math.pow(10, coinDecimal)));
};

export const isLessThanOfTenPowerByCap = (value: any, dicimal: 8) => {
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });
  return value > 0 && new BigNumber(value).lt(new BigNumber(Math.pow(10, dicimal)));
};

export const multipleTwoBigNumber = (first: any, second: any) => {
  if (!first || !second) {
    return 0;
  }
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });
  return new BigNumber(first).multipliedBy(new BigNumber(second)).toString();
};

export const convertToNumber = (value: any) => {
  return value ? new BigNumber(value).toNumber() : ZERO_VALUE;
};

export const limitMaxLengthNumber =
  (maxLength: number = MAX_LENGTH_PRICE) =>
  (inputObj: any) => {
    const { value } = inputObj;
    const integerPath = (value || '').split('.')[0];
    return integerPath.length <= maxLength;
  };

export const getValueAttributes = (attributes: any, field: string) => attributes?.[field]?.text || attributes?.[field];

export const getImageAttributes = (attributes: any, field: string) => attributes?.[field]?.imgUrl;

export const getRowKey = (row: any) => row?._id;

export const setOrderSorter = (order: string | null | undefined) => {
  const newOrder =
    (order === ANTD_ORDERS.ASCEND && ORDERS.ASC) || (order === ANTD_ORDERS.DESCEND && ORDERS.DESC) || null;
  return newOrder;
};

export const getStartDateTimestamp = (value: string) => {
  if (!value) {
    return;
  }
  return moment(value).clone().startOf('days').toISOString();
};

export const getEndDateTimestamp = (value: string) => {
  if (!value) {
    return;
  }
  return moment(value).clone().endOf('days').toISOString();
};

export const nFormatter = (num: any, digits: any = 2) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : num.toFixed(8);
};
