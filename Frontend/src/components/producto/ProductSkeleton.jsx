import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductSkeleton = () => {
	const rows = Array.from({ length: 8 });
	return (
		<div className='container my-5'>
			<div className='row'>
				{rows.map((_, index) => (
					<div key={index} className='col-sm-6 col-md-4 col-lg-3 mb-3'>
						<div className='card h-100 shadow'>
							<Skeleton height={200} className='card-img-top img-fluid' style={{ objectFit: 'cover' }} />
							<h3 className='card-header'>
								<Skeleton width='80%' />
							</h3>
							<div className='card-body'>
								<strong>
									<p className='card-text'>
										<Skeleton width='40%' />
									</p>
								</strong>
								<strong>
									<p className='card-text'>
										<Skeleton width='40%' />
									</p>
								</strong>
								<hr />
								<div className='row align-items-center'>
									<div className='col-6'>
										<Skeleton height={36} />
									</div>
									<div className='col-6'>
										<Skeleton height={36} />
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductSkeleton;
