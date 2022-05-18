import React, { useEffect, useState } from 'react';
import router from 'next/router';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Badge } from 'antd';

import AppDropdown from '../AppDropdown';
import EllipsisText from '../EllipsisText';

import RingIcon from 'public/svg/ring_icon.svg';

import selectedAddress from 'redux/address/selector';
import { useSocket } from 'hooks/useSocket';
import { useAppSelector } from 'hooks/useStore';

import { checkSuccessRequest } from 'services/api';
import notificationService from 'services/notification';

import { formatDate } from 'utils';

import LENGTH_CONSTANTS from 'constants/length';
import { SOCKET_EVENT, ZERO_VALUE } from 'constants/common';

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = LENGTH_CONSTANTS;

const Notification = () => {
  const { t } = useTranslation();
  const { address } = useAppSelector(selectedAddress.getAddress);

  const [page, setPage] = useState(DEFAULT_PAGE);
  const [totalUnread, setTotalUnread] = useState(ZERO_VALUE);
  const [totalNotification, setTotalNotification] = useState(ZERO_VALUE);
  const [listNotification, setListNotification] = useState([]) as Array<any>;

  const handleAddNotification = (data: any) => {
    const newListNotification = [{ ...data, isRead: false }, ...listNotification];
    setListNotification(newListNotification);
    setTotalUnread(totalUnread + 1);
  };

  useSocket({
    event: SOCKET_EVENT.NOTIFICATION,
    handleEvent: handleAddNotification,
    dependencies: [totalUnread, listNotification],
  });

  const getListNotification = async (page: number) => {
    try {
      const response = await notificationService.getListNotification({ page, limit: DEFAULT_PAGE_SIZE });
      if (checkSuccessRequest(response)) {
        const { docs = [], totalDocs = 0, totalUnread = 0 } = response?.data || {};

        setListNotification(page === DEFAULT_PAGE ? [...docs] : [...listNotification, ...docs]);
        setTotalNotification(totalDocs);
        setTotalUnread(totalUnread);
      }
    } catch (error) {}
  };

  useEffect(() => {
    address && setTimeout(() => getListNotification(DEFAULT_PAGE));
  }, [address]);

  const getMoreNotification = () => {
    setPage(page + 1);
    getListNotification(page + 1);
  };

  const handleClickNotification = (notification: any, asPath: string) => async (event: any) => {
    event.preventDefault();
    router.push(asPath);

    if (!notification?.isRead) {
      try {
        const response = await notificationService.setMarkAsRead(notification?._id);
        if (checkSuccessRequest(response)) {
          const newListNotification = listNotification.map((item: any) => {
            return notification?._id === item?._id ? { ...notification, isRead: true } : item;
          });
          setTotalUnread(totalUnread > 0 ? totalUnread - 1 : totalUnread);
          setListNotification(newListNotification);
        }
      } catch (error) {}
    }
  };

  const menu = () => (
    <div className="notification-card">
      <p className="title">{t('notification.txt_title')}</p>
      {totalNotification > ZERO_VALUE ? (
        <InfiniteScroll
          dataLength={listNotification?.length}
          next={getMoreNotification}
          hasMore={listNotification?.length < totalNotification}
          loader={null}
          scrollableTarget="scrollableDiv"
          height="80%"
        >
          {listNotification?.map((notification: any) => {
            const createdDate = notification?.createdAt;
            const content = notification?.content;

            return (
              <div
                key={notification?._id}
                className="group"
                onClick={handleClickNotification(notification, content?.router as string)}
              >
                <div className="content">
                  <EllipsisText text={content?.text} className="text" innerHtml tooltipText={content?.tooltipText} />
                  <p className="sub-text">
                    <span>{formatDate(createdDate)}</span>
                    <span>{formatDate(createdDate)}</span>
                  </p>
                </div>
                <div className="effect">{!notification?.isRead ? <div className="dot" /> : null}</div>
              </div>
            );
          })}
        </InfiniteScroll>
      ) : (
        <div className="notification-empty-text">{t('message.E16')}</div>
      )}
    </div>
  );

  return (
    <AppDropdown overlay={menu} placement="bottomRight" className="notification" trigger={'click'}>
      <Badge count={totalUnread ? totalUnread : null} className="notification-icon">
        <img src={RingIcon} />
      </Badge>
    </AppDropdown>
  );
};

export default Notification;
