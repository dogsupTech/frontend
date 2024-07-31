"use client";

import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import { useAuth } from "@/components/auth/auth";
import LoadingDots from "@/components/LoadingDots";
import { WhiteSpace } from "@/components";

type User = {
	name: string;
	email: string;
};

const columns = [
	{
		title: <span className="rounded-0 bg-white">Namn</span>,
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'Email',
		dataIndex: 'email',
		key: 'email',
	},
];

export default function Users() {
	const { idToken } = useAuth();
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/clinics/users`, {
					headers: {
						Authorization: `Bearer ${idToken}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					setUsers(data);
				} else {
					setError('Failed to fetch users.');
				}
			} catch (error) {
				setError('An error occurred while fetching users.');
			} finally {
				setLoading(false);
			}
		};

		if (idToken) {
			fetchUsers();
		}
	}, [idToken]);

	if (loading) {
		return <div className="flex justify-center items-center h-screen">
			<LoadingDots />
		</div>;
	}

	if (error) {
		return <div className="flex justify-center items-center h-screen">{error}</div>;
	}

	return (
		<div className="mx-[37px] mt-[91px]">
			<div className={"px-[77px]"}>
				<h1 className="text-[40px]">Användare</h1>
				<WhiteSpace height={"14px"} />
				<p className={"min-h-[82px] max-w-[507px] font-inter text-[12px]"}>
					Här ser du en överblick över alla användare som har tillgång till kliniken.
				</p>
				<Spin spinning={loading}>
					<Table
						columns={columns}
						dataSource={users}
						rowKey="email"
						pagination={{
							pageSize: 10,
							className: 'custom-ant-pagination',
						}}						scroll={{ x: 'max-content' }}
						locale={{
							emptyText: 'No users found',
						}}
						rowClassName={(record, index) => `text-[16px] my-[100px] rounded-[8px] ${index % 2 === 0 ? 'bg-[#FCFBFB]' : 'bg-[#F5F6FA]'}`}
						className="custom-ant-table"

					/>
				</Spin>
			</div>
		</div>
	);
}
