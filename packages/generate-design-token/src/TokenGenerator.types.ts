// 데이터 설계

export type TokenObjValue = string | Record<string, string>;

export interface TokenObj {
	[key: `$${string}`]: TokenObjValue;
}

export interface TokenStructureObj {
	[key: string]: TokenStructureObj | TokenObj;
}

export type TokenReference = `{${string}}`;

// TODO(데이터 처리): 토큰 참조값 유효성 검사

export type ValidateTokenObj<T extends object> = keyof T extends ""
	? false
	: keyof T extends `$${infer _}`
		? true
		: false;

// TODO(데이터 처리): 토큰 객체 찾기

// TODO(데이터 처리): 토큰 객체 유효성 검사

// TODO(데이터 처리): 케이스별 객체(토큰, 토큰 구조객체) 찾기

// TODO(데이터 처리): 케이스별 객체(토큰, 토큰 구조객체) 유효성 검사

// 기능 설계

// TODO(기능): 파싱

// TODO(기능): 변환
