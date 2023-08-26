import * as schedule  from 'node-schedule';
import { OBMonitor } from './monit';
import mongoose from 'mongoose';

async function main() {
	
	let monitor: OBMonitor;
	let db: mongoose.Mongoose;

	// #1. SET DB
	try {
		mongoose.set('debug', true);
		db = await mongoose.connect('mongodb+srv://jrscorenet:qkrekfskan@corecluster.q8okyvy.mongodb.net/obmonit');
		console.log('==> DB Connected');
	} catch (err) {
		console.error('Failed to connect to MongoDB', err);
		return; //함수종료
	}
	
	// #2. Scheduler
	schedule.scheduleJob('*/5 7-20 * * *', async () => {  // 1분마다, 7~20시, 
		console.log('==> Crawring Start');
		try {
			// 로그인 확인 및 재로그인 필요 시 수행
			if (!monitor || !await OBMonitor.isLoggedIn) {
				monitor = await OBMonitor.getInstance(); // Page 생성
				await monitor.login();
			}
			let ds = await monitor.fetchdata();
			ds.save();
		} catch (error) {
			console.error("CRAWLING ERROR", error);
		}
	});

}

main();
