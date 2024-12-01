import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TableSkeleton = () => {
	const rows = Array.from({ length: 8 });

	return (
		<div className='container my-5'>
			<div className='row'>
				<Skeleton width={1200} height={20} className='mb-3' />
				<table className='table table-hover table-skeleton'>
					<tbody>
						{rows.map((_, index) => (
							<tr key={index}>
								<th scope='row'>
									<Skeleton width={20} />
								</th>
								<td>
									<Skeleton width={100} />
								</td>
								<td>
									<Skeleton width={50} />
								</td>
								<td>
									<Skeleton width={50} />
								</td>
								<td>
									<div className='d-flex'>
										<Skeleton width={50} height={30} className='me-1' />
										<Skeleton width={50} height={30} />
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TableSkeleton;
