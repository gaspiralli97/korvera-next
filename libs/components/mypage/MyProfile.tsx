import React, { useCallback, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Button, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { Messages, REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateStorage, updateUserInfo } from '../../auth';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberUpdate } from '../../types/member/member.update';
import { UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';

const MyProfile: NextPage = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const [updateData, setUpdateData] = useState<MemberUpdate>(initialValues);
	const [newPassword, setNewPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [updateMember] = useMutation(UPDATE_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		setUpdateData({
			...updateData,
			memberNick: user.memberNick,
			memberPhone: user.memberPhone,
			memberAddress: user.memberAddress,
			memberImage: user.memberImage,
		});
	}, [user]);

	/** HANDLERS **/
	const uploadImage = async (e: any) => {
		try {
			const image = e.target.files?.[0];
			if (!image) return;
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target)
				  }`,
					variables: {
						file: null,
						target: 'member',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.file'],
				}),
			);
			formData.append('0', image);

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImage = response?.data?.data?.imageUploader;
			if (!responseImage) throw new Error('Image upload failed: no response');
			setUpdateData((prev) => ({ ...prev, memberImage: responseImage }));
			await sweetMixinSuccessAlert('Photo uploaded successfully.');
		} catch (err: any) {
			await sweetMixinErrorAlert(err?.message ?? 'Image upload failed.');
		}
	};

	const updateMemberHandler = useCallback(async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			updateData._id = user._id;
			const result = await updateMember({
				variables: { input: updateData },
			});
			const jwtToken = (result.data as any)?.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(result.data.updateMember?.accessToken);
			await sweetMixinSuccessAlert('Profile updated successfully.');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [updateData]);

	const updatePasswordHandler = useCallback(async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (newPassword !== confirmPassword) throw new Error('Passwords do not match.');
			const result = await updateMember({
				variables: { input: { _id: user._id, memberPassword: newPassword } },
			});
			const jwtToken = (result.data as any)?.updateMember?.accessToken;
			await updateStorage({ jwtToken });
			updateUserInfo(result.data.updateMember?.accessToken);
			setNewPassword('');
			setConfirmPassword('');
			await sweetMixinSuccessAlert('Password updated successfully.');
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	}, [newPassword, confirmPassword]);

	const doDisabledCheck = () => {
		if (
			!updateData.memberNick?.trim() ||
			!updateData.memberPhone?.trim() ||
			!updateData.memberAddress?.trim()
		) {
			return true;
		}
	};

	const doPasswordDisabledCheck = () => {
		return newPassword.length < 6 || confirmPassword.length < 6;
	};

	if (device === 'mobile') {
		return <>MY PROFILE PAGE MOBILE</>;
	} else
		return (
			<div id="my-profile-page">

				{/* ── Page Header ── */}
				<div className="mp-header">
					<span className="mp-eyebrow">My Account</span>
					<h2 className="mp-title">Account Information</h2>
					<p className="mp-sub">Manage your profile details and security settings</p>
				</div>

				{/* ── Section 1: Profile Info ── */}
				<div className="mp-section">
					<div className="mp-section-head">
						<span className="mp-section-label">Profile Details</span>
					</div>

					<div className="mp-photo-row">
						<div className="mp-avatar-wrap">
							<img
								src={
									updateData?.memberImage
										? updateData.memberImage.startsWith('/')
											? updateData.memberImage
											: `${REACT_APP_API_URL}/${updateData?.memberImage}`
										: `/img/profile/defaultUser.svg`
								}
								alt="avatar"
								className="mp-avatar"
							/>
						</div>
						<div className="mp-upload-wrap">
							<input
								type="file"
								hidden
								id="hidden-input"
								onChange={uploadImage}
								accept="image/jpg, image/jpeg, image/png"
							/>
							<label htmlFor="hidden-input" className="mp-upload-btn">
								Upload New Photo
							</label>
							<span className="mp-upload-hint">JPG, JPEG or PNG · Max 5MB</span>
						</div>
					</div>

					<div className="mp-fields-row">
						<div className="mp-field">
							<label className="mp-label">Username</label>
							<input
								type="text"
								className="mp-input"
								placeholder="Your username"
								value={updateData.memberNick}
								onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberNick: value })}
							/>
						</div>
						<div className="mp-field">
							<label className="mp-label">Phone</label>
							<input
								type="text"
								className="mp-input"
								placeholder="Your phone number"
								value={updateData.memberPhone}
								onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberPhone: value })}
							/>
						</div>
					</div>

					<div className="mp-field mp-field--full">
						<label className="mp-label">Delivery Address</label>
						<input
							type="text"
							className="mp-input"
							placeholder="Your delivery address"
							value={updateData.memberAddress}
							onChange={({ target: { value } }) => setUpdateData({ ...updateData, memberAddress: value })}
						/>
					</div>

					<div className="mp-actions">
						<button
							className="mp-btn mp-btn--primary"
							onClick={updateMemberHandler}
							disabled={doDisabledCheck()}
						>
							Save Changes
						</button>
					</div>
				</div>

				{/* ── Section 2: Password ── */}
				<div className="mp-section">
					<div className="mp-section-head">
						<span className="mp-section-label">Change Password</span>
					</div>

					<div className="mp-fields-row">
						<div className="mp-field">
							<label className="mp-label">New Password</label>
							<input
								type="password"
								className="mp-input"
								placeholder="Min. 6 characters"
								value={newPassword}
								onChange={({ target: { value } }) => setNewPassword(value)}
							/>
						</div>
						<div className="mp-field">
							<label className="mp-label">Confirm Password</label>
							<input
								type="password"
								className="mp-input"
								placeholder="Repeat new password"
								value={confirmPassword}
								onChange={({ target: { value } }) => setConfirmPassword(value)}
							/>
							{confirmPassword && newPassword !== confirmPassword && (
								<span className="mp-field-error">Passwords do not match</span>
							)}
						</div>
					</div>

					<div className="mp-actions">
						<button
							className="mp-btn mp-btn--primary"
							onClick={updatePasswordHandler}
							disabled={doPasswordDisabledCheck()}
						>
							Update Password
						</button>
					</div>
				</div>

			</div>
		);
};

MyProfile.defaultProps = {
	initialValues: {
		_id: '',
		memberImage: '',
		memberNick: '',
		memberPhone: '',
		memberAddress: '',
	},
};

export default MyProfile;
