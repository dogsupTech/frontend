"use client";

import React, { useState, useEffect } from 'react';
import { Table, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Consultation } from "@/app/consultation/[id]/page";
import { useRouter } from 'next/navigation';

const columns: ColumnsType<Consultation> = [
	{
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: 'Date',
		dataIndex: 'date',
		key: 'date',
		sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	},
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
		sorter: (a, b) => a.name.localeCompare(b.name),
	},
];

type ConsultationTableProps = {
	idToken: string | null;
	isLoading: boolean;
};

const ConsultationTable: React.FC<ConsultationTableProps> = ({ idToken, isLoading }) => {
	const [consultations, setConsultations] = useState<Consultation[]>([]);
	const [tableLoading, setTableLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchConsultations = async () => {
			if (!idToken || isLoading) {
				setTableLoading(true);
				return;
			}

			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/consultations`, {
					headers: {
						"Authorization": `Bearer ${idToken}`,
					},
				});

				if (response.ok) {
					const data = await response.json();
					setConsultations(data);
				} else {
					console.error('Failed to fetch consultations');
				}
			} catch (error) {
				console.error('Error fetching consultations:', error);
			} finally {
				setTableLoading(false);
			}
		};

		fetchConsultations();
	}, [idToken, isLoading]);

	const handleRowClick = (record: Consultation) => {
		router.push(`/consultation/${record.id}`);
	};

	return (
		<Spin spinning={tableLoading}>
			<Table
				columns={columns}
				dataSource={consultations}
				rowKey="id"
				pagination={{ pageSize: 10 }}
				scroll={{ x: 'max-content' }}
				onRow={(record) => ({
					onClick: () => handleRowClick(record),
					style: { cursor: 'pointer' },
				})}
			/>
		</Spin>
	);
};

export default ConsultationTable;
