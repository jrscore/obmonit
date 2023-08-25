import mongoose, { Schema, Document } from 'mongoose';

// 1분마다

// Inverter 인터페이스 정의 (TypeScript에서 사용하기 위함)
export interface IInverter {
	no?: string;
	stt?: string;
	pwr?: string;
	day?: string;
	yld?: string;
}

// Plant 스키마 정의
const plantSchema = new Schema({
	zone: String,
	name: String,
	run: String,
	rtu: String,
	pwr: String,
	day: String,
	yld: String,
	invs: [{
		no: String,
		stt: String,
		pwr: String,
		day: String,
		yld: String,
		_id: false 
	}] // Inverter 배열
}, { timestamps: true });

// Plant 인터페이스 정의 (TypeScript에서 사용하기 위함)
export interface IPlant extends Document {
  zone?: string;
  name?: string;
  run?: string;
  rtu?: string;
  pwr?: string;
  day?: string;
  yld?: string;
  invs?: IInverter[];
}

// Plant 모델 정의
export const PlantModel = mongoose.model<IPlant>('plants', plantSchema);

