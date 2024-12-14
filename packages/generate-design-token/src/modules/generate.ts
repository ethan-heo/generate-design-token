import { TokenGroup, TokenObj } from "../types/token.types";
import { isObject, isString, isUndefined } from "../utils/type-checker";
import { isTokenObj } from "../utils/token-obj";
import * as ejs from "ejs";
import { Options as EjsOptions } from "ejs";
import { Config as PrettierConfig } from "prettier";
import Token from "./token";
import fs from "fs/promises";
import nPath from "node:path";
import prettier from "prettier";

export type EJSTemplateTokenData = {
	props: string[];
	value: TokenObj | TokenGroup;
	meta: Record<`$${string}`, any>;
};

export type EJSTemplateTopLevelMetaData = Record<`$${string}`, any>;

export type GenerateContentsOptions = {
	/**
	 * ejs 템플릿 및 템플릿 경로, 둘 중 하나는 무조건 정의해야 함. 둘다 정의한다면 content가 우선적
	 */
	template: {
		contents?: string;
		path?: string;
	};
	/**
	 * 파일 확장자
	 */
	extname: string;
	/**
	 * 사용자 정의 ejs 템플릿 데이터
	 */
	ejsData?: Record<string, any>;
	/**
	 * ejs 템플릿 옵션
	 */
	ejsOptions?: EjsOptions;
	/**
	 * ejs 템플릿 헬퍼 함수 등록
	 */
	ejsHelper?: Record<string, (...args: any[]) => any>;
	/**
	 * prettier 설정
	 */
	prettierConfig?: PrettierConfig;
};

/**
 * TokenGroup을 EJS 템플릿에 적용하여 contents를 생성합니다.
 * @param token - TokenGroup
 * @param options - GenerateContentsOptions
 * @returns {Promise<string>} 생성된 contents
 */
export const generateContents = async (
	token: TokenGroup,
	options: GenerateContentsOptions,
) => {
	if (isUndefined(global)) {
		throw new Error("Node 환경에서 사용할 수 있습니다.");
	}

	if (
		!isString(options.template.contents) &&
		!isString(options.template.path)
	) {
		throw new Error("template.path or template.content를 정의해주세요");
	}

	const {
		extname,
		template = {},
		ejsOptions,
		ejsHelper = {},
		ejsData = {},
	} = options;
	let _template;

	switch (true) {
		case isString(template.contents):
			_template = template.contents;
			break;
		case isString(template.path):
			_template = await fs.readFile(nPath.resolve(template.path), {
				encoding: "utf-8",
			});
			break;
	}

	let contents = await ejs.compile(_template, { async: true, ...ejsOptions })({
		tokens: getTokenData(token),
		topLevelMeta: getTopLevelMetaData(token),
		isTokenObj,
		...ejsData,
		...ejsHelper,
	});

	return await prettier.format(contents, {
		parser: extname,
	});

	/**
	 * 토큰에 대한 메타데이터를 추출하는 함수
	 * @param token - 토큰
	 * @param excludes - 추출하고 싶지 않은 메타데이터의 키
	 * @returns {EJSTemplateTokenData["meta"]} 추출된 메타데이터
	 */
	function pickMeta(
		token: TokenObj | TokenGroup,
		excludes: string[] = [],
	): EJSTemplateTokenData["meta"] {
		const result: EJSTemplateTokenData["meta"] = {};

		for (const prop in token) {
			if (excludes.includes(prop)) continue;

			if (prop.startsWith("$")) {
				result[prop] = token[prop];
			}
		}

		return result;
	}

	/**
	 * TokenGroup에서 토큰을 추출하여 EJSTemplateTokenData 형식으로 반환합니다.
	 * @param token - 토큰 그룹
	 * @returns EJSTemplateTokenData[]
	 */
	function getTokenData(token: TokenGroup): EJSTemplateTokenData[] {
		return new Token(token)
			.findAll((_, token) => isObject(token) && isTokenObj(token))
			.map(([props, value]) => {
				if (isTokenObj(value)) {
					return {
						props,
						value,
						meta: pickMeta(value, ["$type", "$value"]),
					};
				} else {
					return {
						props,
						value,
						meta: pickMeta(value),
					};
				}
			});
	}

	/**
	 * 토큰 그룹에서 최상위 메타데이터를 추출하여 반환합니다.
	 * @param token - 토큰 그룹
	 * @returns 최상위 메타데이터
	 */
	function getTopLevelMetaData(token: TokenGroup) {
		return Object.entries(token)
			.filter(([prop]) => prop.startsWith("$"))
			.reduce((acc, [prop, value]) => {
				acc[prop] = value;
				return acc;
			}, {});
	}
};

export type GenerateFileOptions = {
	/**
	 * 생성할 파일 이름
	 */
	filename: string;
	/**
	 * 생성할 파일 경로
	 */
	outputPath: string;
} & GenerateContentsOptions;

/**
 * TokenGroup을 파일로 생성합니다.
 *
 * @param token - 생성할 토큰 그룹
 * @param options - 생성할 파일의 경로, 이름, ejs 템플릿 등의 옵션
 *
 * @returns 생성이 완료된 Promise
 */
export const generateFile = async (
	token: TokenGroup,
	options: GenerateFileOptions,
) => {
	if (isString(options.filename)) {
		if (!nPath.extname(options.filename)) {
			throw new Error(`filename에 확장자가 없습니다. ${options.filename}`);
		}
	} else {
		throw new Error(`filename은 문자열 형식이어야 합니다.`);
	}

	if (!isString(options.outputPath)) {
		throw new Error(`outputPath는 문자열 형식이어야 합니다.`);
	}

	const contents = await generateContents(token, options);

	await fs.mkdir(options.outputPath, { recursive: true });
	await fs.writeFile(
		nPath.resolve(options.outputPath, options.filename),
		contents,
		{
			encoding: "utf-8",
		},
	);
};
