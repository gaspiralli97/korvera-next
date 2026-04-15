import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Avatar } from '@mui/material';
import { useRouter } from 'next/router';
import { userVar } from '../../apollo/store';
import { GET_MY_NOTIFICATIONS, GET_UNREAD_NOTIFICATIONS_COUNT } from '../../apollo/user/query';
import { UPDATE_NOTIFICATION, MARK_ALL_NOTIFICATIONS_READ } from '../../apollo/user/mutation';
import { Notification } from '../types/notification/notification';
import { NotificationStatus } from '../enums/notification.enum';
import { REACT_APP_API_URL } from '../config';

interface Props {
	isMobile?: boolean;
}

const NotificationDropdown = ({ isMobile = false }: Props) => {
	const user = useReactiveVar(userVar);
	const [open, setOpen] = useState(false);
	const dropRef = useRef<HTMLDivElement>(null);
	const router = useRouter();

	const { data: countData, refetch: refetchCount } = useQuery(GET_UNREAD_NOTIFICATIONS_COUNT, {
		skip: !user?._id,
		pollInterval: 30000,
		fetchPolicy: 'network-only',
	});

	const { data: notifData, refetch: refetchNotifs } = useQuery(GET_MY_NOTIFICATIONS, {
		skip: !user?._id || !open,
		variables: { input: { page: 1, limit: 20 } },
		fetchPolicy: 'network-only',
	});

	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
	const [markAllRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);

	const unreadCount: number = countData?.getUnreadNotificationsCount ?? 0;
	const notifications: Notification[] = notifData?.getMyNotifications?.list ?? [];

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
			await refetchCount();
			await refetchNotifs();
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
	const activeIconClass = isMobile ? 'mob-notif-icon' : 'notif-bell-icon notif-bell-active';
	const badgeClass = isMobile ? 'mob-notif-badge' : 'notif-badge';

	return (
		<div className={wrapClass} ref={dropRef}>
			<button className={btnClass} onClick={() => setOpen((p) => !p)}>
				{unreadCount > 0 ? (
					<NotificationsIcon className={activeIconClass} />
				) : (
					<NotificationsNoneIcon className={iconClass} />
				)}
				{unreadCount > 0 && (
					<span className={badgeClass}>{unreadCount > 99 ? '99+' : unreadCount}</span>
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
							notifications.map((notif) => {
								const avatar = notif.authorData?.memberImage
									? `${REACT_APP_API_URL}/${notif.authorData.memberImage}`
									: '/img/profile/defaultUser.svg';
								return (
									<div
										key={notif._id}
										className={`notif-item${notif.notificationStatus === NotificationStatus.WAIT ? ' unread' : ''}`}
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
										{notif.notificationStatus === NotificationStatus.WAIT && (
											<span className={'notif-dot'} />
										)}
									</div>
								);
							})
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default NotificationDropdown;
