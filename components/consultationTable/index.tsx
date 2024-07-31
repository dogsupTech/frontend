"use client";

import React, { useState, useEffect } from 'react';
import { Table, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Consultation } from "@/app/consultation/[id]/page";
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const columns: ColumnsType<Consultation> = [
	{
		title: <span className="rounded-0">Namn</span>,
		dataIndex: 'name',
		key: 'name',
		sorter: (a, b) => a.name.localeCompare(b.name),
	},
	{
		title: <span className="custom-header">Datum</span>,
		dataIndex: 'date',
		key: 'date',
		sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
		render: (date: string) => format(new Date(date), 'dd/MM/yyyy'),
	},
	{
		title: '',
		dataIndex: 'action',
		key: 'action',
		render: (_, record) => (
			<span className={"flex flex-row justify-center"}>
				<svg xmlns="http://www.w3.org/2000/svg" width="9" height="16" viewBox="0 0 9 16" fill="none">
  <path
	  d="M9 7.99406C9 8.16474 8.97129 8.33014 8.91387 8.49027C8.85645 8.6504 8.75789 8.80045 8.61819 8.94044L1.88642 15.6861C1.67017 15.9028 1.41181 16.0073 1.11134 15.9996C0.810874 15.992 0.552514 15.8798 0.336263 15.663C0.120011 15.4463 0.0118845 15.1836 0.0118845 14.8749C0.0118845 14.5662 0.120011 14.3034 0.336263 14.0867L6.41644 7.99406L0.313311 1.87839C0.0970591 1.66169 -0.00724694 1.4028 0.000391033 1.10172C0.00805389 0.800655 0.120011 0.541777 0.336263 0.32508C0.552515 0.108359 0.814706 9.71527e-09 1.12284 1.33897e-08C1.43094 1.70638e-08 1.69312 0.108359 1.90937 0.32508L8.61819 7.04769C8.75789 7.18767 8.85645 7.33533 8.91387 7.49068C8.97129 7.64599 9 7.81379 9 7.99406Z"
	  fill="#171717"/>
</svg>
			</span>
		),
	},
];

type ConsultationTableProps = {
	idToken: string | null;
	isLoading: boolean;
};

const ConsultationTable: React.FC<ConsultationTableProps> = ({idToken, isLoading}) => {
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
				pagination={{
					pageSize: 10,
					className: 'custom-ant-pagination',
				}}				scroll={{ x: 'max-content' }}
				onRow={(record) => ({
					onClick: () => handleRowClick(record),
					style: { cursor: 'pointer' },
				})}
				rowClassName={(record, index) => `text-[16px] my-[100px] rounded-[8px] ${index % 2 === 0 ? 'bg-[#FCFBFB]' : 'bg-[#F5F6FA]'}`}
				locale={{
					emptyText: 'No consultations found',
				}}
				className="custom-ant-table"
			/>
		</Spin>
	);
};

export default ConsultationTable;
