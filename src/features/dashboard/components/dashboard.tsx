import React from 'react';
import { Grid, Typography, Box, Card, Grow, Stack } from '@mui/material';
import LineGraph from '../line-graph';
import { default as styles } from './styles'
import moment from 'moment';
//Icons
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InfoIcon from '@mui/icons-material/Info';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';

const Dashboard = ({
	salesGraphInfo,
	itemSold,
	totalAmount,
	gramsSoldInfo,
	warningLevels
}) => {

	const statusColor = (status) => {
		switch (status) {
			case "Low":
				return "warning";
			case "Sufficient":
				return "success";
			case "Critical":
				return "error";
			case "OverStock":
				return "info";
			case "OutOfStock":
				return "#878787";
		};
	};

	const salesByYear = () => {
		const months = salesGraphInfo.labels.filter(y => y.includes(moment().format("YYYY")));
		const salesInfo = salesGraphInfo.labels.reduce((o, k, i) => ({ ...o, [k]: salesGraphInfo.values[i] }), {});

		let filteredValues = [];

		loop1:
		for (const month of months) {
			for (let [key, value] of Object.entries(salesInfo)) {
				if (month === key) {
					filteredValues.push(value);
					continue loop1;
				}
			}
			filteredValues.push(0)
		}

		const data = {
			labels: months,
			datasets: [{
				label: "Sales (PHP)",
				data: filteredValues,
				borderColor: "green",
				tension: 0.5
			}],
		};
		return data;
	};

	return (
		<Grid container spacing={2} >
			<Grid item md={12} xs={12}>
				<Typography
					variant='h6'
					sx={styles.overviewText}>
					Dashboard
				</Typography>
			</Grid>
			<Grid item md={6} xs={12} width={'100%'}>
				<Grow in={true} timeout={800}>
					<Card sx={styles.overviewCard}>
						<Typography
							variant="h6"
							sx={styles.overviewText}> Today's sales
						</Typography>
						<Grid container>
							<Grid
								item xs={12} md={6}
								sx={styles.overviewContent}>
								<RestaurantRoundedIcon sx={styles.overviewIcon} />
								<Box sx={styles.overviewTextWrap}>
									<Typography sx={styles.overviewText}>
										Sold
									</Typography>
									<Typography	sx={styles.overviewSubText}>
										{itemSold == null || itemSold == 0 || itemSold == undefined ? 0 : itemSold}
									</Typography>
								</Box>
							</Grid>
							<Grid
								item xs={12} md={6}
								sx={styles.overviewContent}>
								<PaymentsRoundedIcon sx={styles.overviewIcon} />
								<Box sx={styles.overviewTextWrap}>
									<Typography
										sx={styles.overviewText}>Amount</Typography>
									<Typography
										sx={styles.overviewSubText}>₱ {totalAmount == null || totalAmount == 0 || totalAmount == undefined ? 0 : totalAmount}
									</Typography>
								</Box>
							</Grid>
						</Grid>
					</Card>
				</Grow>
			</Grid>

			<Grid item md={6} xs={12} width={'100%'}>
				<Grow in={true} timeout={800}>
					<Card sx={styles.overviewCard}>
						<Typography
							variant="h6"
							sx={styles.overviewText}>Inventory Summary</Typography>
						<Grid container spacing={1}>

							<Grid
								item xs={12} md={3}
								sx={styles.overviewContent}>
								<WarningRoundedIcon sx={styles.inventoryIcons} color="warning" />
								<Box sx={styles.overviewTextWrap}>
									<Typography
										sx={styles.overviewText} >Low</Typography>
									<Typography sx={styles.overviewSubText}>{warningLevels.Low == null || warningLevels.Low == 0 || warningLevels.Low == undefined ? 0 : warningLevels.Low}</Typography>
								</Box>
							</Grid>
							<Grid
								item xs={12} md={3}
								sx={styles.overviewContent}>
								<ErrorRoundedIcon sx={styles.inventoryIcons} color="error" />
								<Box sx={styles.overviewTextWrap}>
									<Typography
										sx={styles.overviewText} >Critical</Typography>
									<Typography
										sx={styles.overviewSubText}>{warningLevels.Critical == null || warningLevels.Critical == 0 || warningLevels.Critical == undefined ? 0 : warningLevels.Critical}</Typography>
								</Box>
							</Grid>
							<Grid
								item xs={12} md={3}
								sx={styles.overviewContent}>
								<InfoIcon sx={styles.inventoryIcons} color="info" />
								<Box sx={styles.overviewTextWrap}>
									<Typography variant="caption" sx={styles.specialText}
									>Overstock</Typography>
									<Typography
										sx={styles.overviewSubText}>{warningLevels.OverStock == null || warningLevels.OverStock == 0 || warningLevels.OverStock == undefined ? 0 : warningLevels.OverStock}</Typography>
								</Box>
							</Grid>
							<Grid
								item xs={12} md={3}
								sx={styles.overviewContent}>
								<HighlightOffRoundedIcon sx={{
									fontSize: '5.5ch',
									m: 1,
									color: '#878787'
								}} />
								<Box sx={styles.overviewTextWrap}>
									<Typography
										variant="caption" fontWeight={600} sx={styles.specialText} >Out </Typography>
									<Typography
										sx={styles.overviewSubText}>{warningLevels.OutOfStock == null || warningLevels.OutOfStock == 0 || warningLevels.OutOfStock == undefined ? 0 : warningLevels.OutOfStock}</Typography>
								</Box>
							</Grid>

						</Grid>
					</Card>
				</Grow>
			</Grid>

			<Grid item md={12} xs={12} width={'100%'} >
				<Card>
					{/* <LineGraph data={salesByYear()} height={"75%"} /> */}
				</Card>
			</Grid>

			<Grid item md={12}>
				<Grow in={true} timeout={800}>
					<Card sx={styles.overviewCard}>
						<Stack>
							<Typography
								variant="caption">
								Grams Sold in
							</Typography>
							<Typography
								variant="h6"
								sx={{ color: 'rgba(0, 0, 0, 0.70)', fontWeight: 700, }}>
								Milktea Flavors
							</Typography>
						</Stack>

						<Grid item md={12} sx={styles.overviewContent}>
							<Stack direction="row" spacing={2}>
								<Stack direction="row" spacing={1}>
									<Box sx={styles.overviewContent}>
										<SquareRoundedIcon sx={{ fontSize: 10 }} color="success" />
									</Box>
									<Typography>Sufficient</Typography>
								</Stack>
								<Stack direction="row" spacing={1}>
									<Box sx={styles.overviewContent}>
										<SquareRoundedIcon sx={{ fontSize: 10 }} color="warning" />
									</Box>
									<Typography>Low</Typography>
								</Stack>
								<Stack direction="row" spacing={1}>
									<Box sx={styles.overviewContent}>
										<SquareRoundedIcon sx={{ fontSize: 10 }} color="error" />
									</Box>
									<Typography>Critical</Typography>
								</Stack>
								<Stack direction="row" spacing={1}>
									<Box sx={styles.overviewContent}>
										<SquareRoundedIcon sx={{ fontSize: 10 }} color="info" />
									</Box>
									<Typography>Overstock</Typography>
								</Stack>
								<Stack direction="row" spacing={1}>
									<Box sx={styles.overviewContent}>
										<SquareRoundedIcon sx={{ fontSize: 10 }} color="#878787" />
									</Box>
									<Typography>Out of Stock</Typography>
								</Stack>
							</Stack>
						</Grid>
						<Grid container mt={2}>
							{gramsSoldInfo.map((s, index) => (
								<Grid item container md={3} mt={2} key={index}>
									<Grid item md={3}>
										<SquareRoundedIcon color={statusColor(s.status)} />
									</Grid>
									<Grid item md={9}>
										<Typography fontWeight={600}>{s.name}</Typography>
										<Stack mt={1}>
											<Typography variant='caption'>Grams Sold</Typography>
											<Typography variant='subtitle1'>{s.gramsSold}g</Typography>
										</Stack>
										<Stack mt={1} >
											<Typography variant='caption'>Reset Date</Typography>
											<Typography>
												{s.resetDate == null || s.resetDate == 0 || s.resetDate == undefined ? "None" : s.resetDate}
											</Typography>
										</Stack>
										<Stack mt={1}>
											<Typography variant='caption'>Previous Measure</Typography>
											<Typography>
												{s.previousMeasure == null || s.previousMeasure == 0 || s.previousMeasure == undefined ? 0 : s.previousMeasure}</Typography>
										</Stack>
									</Grid>
								</Grid>
							))}
						</Grid>
					</Card>
				</Grow>
			</Grid>
		</Grid >
	);
};

export default Dashboard;