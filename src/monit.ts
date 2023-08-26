import { IInverter, IPlant, PlantModel } from './model';
import puppeteer, { Browser, Page } from "puppeteer";

// 1분마다

export class OBMonitor {
	private static instance: OBMonitor;
	public static isLoggedIn: boolean = false
	private browser!: Browser;
	private page!: Page;

	private constructor() {
		this.init();
	}

	private async init() {
		this.browser = await puppeteer.launch({
			headless: new,
			defaultViewport: null,
			args: [],
		});
		const pages = await this.browser.pages();
		this.page = pages[0];
	}

	public static async getInstance(): Promise<OBMonitor> {
		if (!OBMonitor.instance) {
			OBMonitor.instance = new OBMonitor();
			await OBMonitor.instance.init(); // init 메서드를 여기서 호출하고 완료될 때까지 기다립니다.
		}
		return OBMonitor.instance;
	}

	public async login(): Promise<void> {
		try {
			await this.page.goto('https://www.octo.co.kr/', { waitUntil: 'networkidle0' });
			await wait(3000);
			await this.page.type('#user-id', 'obgwangju_aeonus_2', { delay: 100 });
			await this.page.type('#user-password', '3368', { delay: 100 });

			await new Promise(r => setTimeout(r, 3000))

			await this.page.evaluate(() => {
				let btn = document.querySelector('.Basic-Button.Red')! as HTMLElement;  // 적절한 CSS 선택자 사용
				btn.click();
			});
			OBMonitor.isLoggedIn = true;
			console.log('Logged in')
			// await this.page.waitForNavigation({ waitUntil: 'networkidle0'});
		} catch (error: any) {
			console.error('ERROR=>', error);
			throw error;
		}
	}


	public async fetchdata(): Promise<InstanceType<typeof PlantModel>> {
		// 로그기록 :
		//ttps://emsapi.atlasconn.com:12443/api/v1/inverter/log/min?mcno=9111&datetimeFrom=230808000000&datetimeTo=230808235959&timeInterval=60&maxCnt=744&

		//#Step0.  Fetch Json
		//https://emsapi.atlasconn.com:12443/api/v1/inverter/daytotal
		await this.page.goto('https://www.octo.co.kr/#/power/')
		let gridjs = await this.page.waitForResponse(res => res.url().includes('inverter/daytotal')).then(res => res.json())
		gridjs = gridjs.response

		await wait(3000)

		//https://emsapi.atlasconn.com:12443/api/v1/inverter/data?mcno=9111
		await this.page.goto('https://www.octo.co.kr/#/management/inverter');
		let invsjs = await this.page.waitForResponse(
			res => res.url().includes('inverter/data')
		).then(res => res.json())
		invsjs = invsjs.response.inverters[0].inverters


		// #Step1. Inverter
		let invs: IInverter[] = invsjs.map((inv: any, idx: number) => ({
			no: idx + 1,
			stt: inv.isRun ? 'on' : 'off',
			pwr: inv.ackw,
			day: inv.dayTotal,
			yld: inv.total
		}));

		// #Step1. Grid
		let plantData = new PlantModel({
			zone: '광주',
			name: 'OB',
			run: 'on',
			rtu: 'on',
			pwr: gridjs.ackw,
			day: gridjs.dayTotal,
			yld: gridjs.total,
			invs: invs
		});

		return plantData;
	}

	public async fetchlog(): Promise<void> {
		// 로그기록 :
		//ttps://emsapi.atlasconn.com:12443/api/v1/inverter/log/min?mcno=9111&datetimeFrom=230808000000&datetimeTo=230808235959&timeInterval=60&maxCnt=744&
	}

}


function wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
