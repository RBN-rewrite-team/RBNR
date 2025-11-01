import type { ResetRecord } from '@/core/stats';
import { format } from '@/utils/format';
import { defineComponent, type PropType } from 'vue';
import './resetTable.scss';
// 格式化时间戳为可读时间
const formatTimestamp = (timestamp: number): string => {
	return new Date(timestamp).toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});
};

export default defineComponent({
	name: 'ResetTables',
	props: {
		data: {
			type: Object as PropType<ResetRecord[]>,
			required: true,
		},
		currency: {
			type: String,
		},
	},
	setup(props, ctx) {
		const data = props.data;
		return () => (
			<div class="table-container ">
				<table class="gain-table">
					<thead>
						<tr>
							<th style={{ width: '200px' }}>时间</th>
							<th style={{ width: '175px' }}>获取量</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<td style={{ textAlign: 'center', padding: '8px' }}>
									{formatTimestamp(item.last)}
								</td>
								<td style={{ textAlign: 'center', padding: '8px' }}>
									{format(item.gain)} {props.currency ?? ''}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{data.length === 0 && (
					<div style={{ textAlign: 'center', padding: '20px' }}>暂无数据</div>
				)}
			</div>
		);
	},
});
