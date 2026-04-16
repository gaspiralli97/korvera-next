import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Avatar } from '@mui/material';
import { useRouter } from 'next/router';
import { userVar } from '../../apollo/store';
import { GET_MY_NOTIFICATIONS, GET_UNREAD_NOTIFICATIONS_COUNT } from '../../apollo/user/query';
import { UPDATE_NOTIFICATION, MARK_ALL_NOTIFICATIONS_READ } from '../../apollo/user/mutation';
import { Notification } from '../types/notification/notification';
import { NotificationStatus } from '../enums/notification.enum';
import { REACT_APP_API_URL } from '../config';

const LIMIT = 10;

interface Props {
	isMobile?: boolean;
}

const NotificationDropdown = ({ isMobile = false }: Props) => {
	const user = useReactiveVar(userVar);
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const dropRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const { data: countData, refetch: refetchCount } = useQuery(GET_UNREAD_NOTIFICATIONS_COUNT, {
		skip: !user?._id,
		pollInterval: 30000,
		fetchPolicy: 'network-only',
	});

	const { data: notifData } = useQuery(GET_MY_NOTIFICATIONS, {
		skip: !user?._id || !open,
		variables: { input: { page, limit: LIMIT, notificationStatus: NotificationStatus.WAIT } },
		fetchPolicy: 'network-only',
	});

	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
	const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

	const unreadCount: number = countData?.getUnreadNotificationsCount ?? 0;
	const total: number = notifData?.getMyNotifications?.metaCounter?.[0]?.total ?? 0;
	const hasMore = notifications.length < total;

	// Reset list when dropdown opens
	useEffect(() => {
		if (!open) return;
		setPage(1);
		setNotifications([]);
	}, [open]);

	// Append incoming data to list
	useEffect(() => {
		const list: Notification[] = notifData?.getMyNotifications?.list ?? [];
		if (!list.length) return;
		setNotifications((prev) => (page === 1 ? list : [...prev, ...list]));
	}, [notifData]);

	// Close on outside click
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleMarkAllRead = async () => {
		try {
			await markAllRead();
			setNotifications([]);
			setPage(1);
			await refetchCount();
		} catch {}
	};

	const handleNotificationClick = async (notif: Notification) => {
		try {
			if (notif.notificationStatus === NotificationStatus.WAIT) {
				await updateNotification({ variables: { input: { _id: notif._id } } });
				refetchCount();
			}
		} catch {}
		setOpen(false);
		if (notif.productId) {
			router.push(`/product/detail?id=${notif.productId}`);
		} else if (notif.articleId) {
			router.push(`/community/detail?id=${notif.articleId}`);
		} else {
			router.push(`/member?memberId=${notif.authorId}`);
		}
	};

	const formatTime = (date: Date): string => {
		const diff = Date.now() - new Date(date).getTime();
		const minutes = Math.floor(diff / 60000);
		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		return `${Math.floor(hours / 24)}d ago`;
	};

	if (!user?._id) return null;

	const wrapClass = isMobile ? 'mob-notif-wrap' : 'notif-wrap';
	const btnClass = isMobile ? 'mob-notif-btn' : 'notif-bell-btn';
	const iconClass = isMobile ? 'mob-notif-icon' : 'notif-bell-icon';
	const badgeClass = isMobile ? 'mob-notif-badge' : 'notif-badge';

	return (
		<div className={wrapClass} ref={dropRef}>
			<button className={btnClass} onClick={() => setOpen((p) => !p)}>
				<NotificationsIcon className={iconClass} />
				{unreadCount > 0 ? (
					<span className={badgeClass}>{unreadCount > 99 ? '99+' : unreadCount}</span>
				) : (
					<span className={`${badgeClass} notif-badge-dot`} />
				)}
			</button>

			{open && (
				<div className={'notif-dropdown'}>
					<div className={'notif-header'}>
						<span className={'notif-header-title'}>Notifications</span>
						{unreadCount > 0 && (
							<button className={'notif-mark-all'} onClick={handleMarkAllRead}>
								Mark all read
							</button>
						)}
					</div>
					<div className={'notif-list'}>
						{notifications.length === 0 ? (
							<div className={'notif-empty'}>No notifications yet</div>
						) : (
							<>
								{notifications.map((notif) => {
									const avatar = notif.authorData?.memberImage
										? `${REACT_APP_API_URL}/${notif.authorData.memberImage}`
										: '/img/profile/defaultUser.svg';
									return (
										<div
											key={notif._id}
											className={'notif-item unread'}
											onClick={() => handleNotificationClick(notif)}
										>
											<Avatar src={avatar} alt={notif.authorData?.memberNick ?? ''} className={'notif-avatar'} />
											<div className={'notif-content'}>
												<p className={'notif-title'}>{notif.notificationTitle}</p>
												{notif.notificationDesc && (
													<p className={'notif-desc'}>{notif.notificationDesc}</p>
												)}
												<span className={'notif-time'}>{formatTime(notif.createdAt)}</span>
											</div>
											<span className={'notif-dot'} />
										</div>
									);
								})}
								{hasMore && (
									<button
										className={'notif-load-more'}
										onClick={() => setPage((p) => p + 1)}
									>
										Load more
									</button>
								)}
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationDropdown;
