import { TokenGroup, TokenObj } from "../types/token.types";
import { isString, isUndefined } from "../utils/type-checker";
import { isTokenObj } from "../utils/token-obj";
import { validate } from "./validate";
import * as ejs from "ejs";
import { Options as EjsOptions } from "ejs";
import { Config as PrettierConfig } from "prettier";
import Token from "./token";
import fs from "fs/promises";
import nPath from "node:path";
import prettier from "prettier";

type EJSTokenData = {
	props: string[];
	value: TokenObj;
	meta: Record<`$${string}`, any>;
};

type EJSTemplatePath = string;

export type GenerateOptions = {
	/**
	 * 생성할 파일 이름
	 */
	filename: string;
	/**
	 * 생성할 파일 경로
	 */
	path: string;
	/**
	 * ejs 템플릿 및 템플릿 경로
	 */
	template: string | EJSTemplatePath;
	/**
	 * ejs 템플릿 데이터 { custom: DATA }
	 */
	ejsData?: any;
	/**
	 * ejs 템플릿 옵션
	 */
	ejsOptions?: EjsOptions;
	/**
	 * ejs 템플릿 헬퍼 함수 등록
	 */
	ejsHelper?: Record<string, (tokenData: EJSTokenData) => any>;
	/**
	 * prettier 설정
	 */
	prettierConfig?: PrettierConfig;
};

/**
 * TokenGroup을 파일로 생성합니다.
 *
 * @param token 생성할 TokenGroup
 * @param options 생성할 파일의 경로, 이름, ejs 템플릿 등의 옵션
 *
 * @return 생성이 완료된 Promise
 */
const generate = async (token: TokenGroup, options: GenerateOptions) => {
	if (isUndefined(global)) {
		throw new Error("Node 환경에서 사용할 수 있습니다.");
	}

	validate(token);

	const {
		path,
		filename,
		template,
		ejsOptions,
		ejsHelper = {},
		ejsData,
	} = validateOptions(options);
	const data: EJSTokenData[] = new Token(token)
		.filter((_, token) => isTokenObj(token))
		.map(([props, token]) => {
			return {
				props,
				value: {
					$type: token.$type,
					$value: token.$value,
				},
				meta: pickMeta(token, ["$type", "$value"]),
			};
		});

	let _template = template;

	if (_template.includes(nPath.sep)) {
		_template = await fs.readFile(nPath.resolve(_template), {
			encoding: "utf-8",
		});
	}

	let contents = await ejs.compile(_template, { async: true, ...ejsOptions })({
		tokens: data,
		custom: ejsData,
		...ejsHelper,
	});

	contents = await prettier.format(contents, {
		parser: nPath.extname(filename).slice(1),
	});

	await fs.mkdir(path, { recursive: true });
	await fs.writeFile(nPath.resolve(path, filename), contents, {
		encoding: "utf-8",
	});
};

export default generate;

function validateOptions(options: GenerateOptions) {
	if (isString(options.filename)) {
		if (!nPath.extname(options.filename)) {
			throw new Error(`filename에 확장자가 없습니다. ${options.filename}`);
		}
	} else {
		throw new Error(`filename은 문자열 형식이어야 합니다.`);
	}

	if (!isString(options.path)) {
		throw new Error(`path는 문자열 형식이어야 합니다.`);
	}

	if (!isString(options.template)) {
		throw new Error(
			`template는 ejs 템플릿 경로 또는 ejs 템플릿 문자열 가진 문자열 형식이어야 합니다.`,
		);
	}

	return options;
}

/**
 * 토큰에 대한 메타데이터를 추출하는 함수
 * @param token - 토큰
 * @param excludes - 추출하고 싶지 않은 메타데이터의 키
 * @returns {EJSTokenData["meta"]} 추출된 메타데이터
 */
function pickMeta(
	token: TokenObj | TokenGroup,
	excludes: string[] = [],
): EJSTokenData["meta"] {
	const result: EJSTokenData["meta"] = {};

	for (const prop in token) {
		if (!excludes.includes(prop) && prop.startsWith("$")) {
			result[prop] = token;
		}
	}

	return result;
}
