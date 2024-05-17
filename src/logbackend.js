const level = require("level");
const express = require("express");
const multer = require("multer");
const db = new level.Level("my-db");


const app = express();
const upload = multer();

const port = 11451;// 监听端口，防火墙要开放
const fronturl = 'https://log.dice.com/';// 前端地址
const writepath = '/dice/api/log';// 上传log路径
const readpath = '/dice/api/load_data';// 读取log路径
const filesizelimit = 2;

app.use(upload.single('file'), async (req, res) => {
	res.header(Object.assign(cors));
	await handleRequest(req).then(
		result => {
			res.status(result.status).send(result.data)
		}).catch(
			err => {
				res.status(500).send(err.message)
			});
});

// 监听端口 云服务器防火墙要开放这个端口
app.listen(port, () => {
	console.log(`正在监听${port}端口`);
});

// 跨域
const cors = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Methods": "GET, POST, PUT",
	"Access-Control-Allow-Headers": "Content-Type, Accept-Version",
	"Access-Control-Allow-Origin": fronturl.slice(0, -1),
};

// 拦截请求
/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
const handleRequest = async (request) => {
	const url = new URL(fronturl.slice(0, -1) + request.url);
	const pathname = url.pathname;

	if (request.method === 'OPTIONS') {
		return { data: JSON.stringify(''), status: 200 };
	}

	// 上传log
	if (pathname === writepath && request.method === "PUT") {

		//检查文件大小是否超过2MB，若超过，则舍弃。
		const contentLength = request.get("Content-Length");
		if (contentLength && parseInt(contentLength, 10) > filesizelimit * 1024 * 1024) {
			return {
				data: JSON.stringify({
					success: false,
					message: `File size exceeds ${filesizelimit}MB limit`,
				}), status: 400
			};
		}

		//获取对应formData的属性
		var tempData = request.body;
		var name = tempData["name"];
		var file = request.file;
		var uniform_id = tempData["uniform_id"];

		//检验uniform_id的正确性
		var patt1 = /^[^:]+:\d+$/;
		if (!patt1.test(uniform_id)) {
			//返回未能通过的信息：uniform_id field did not pass validation
			return {
				data: JSON.stringify({
					data: "uniform_id field did not pass validation",
				}), status: 400
			};
		}

		//检验file文件的大小
		if (file.size > filesizelimit * 1024 * 1024) {
			return { data: JSON.stringify({ data: "Size is too big!" }), status: 400 };
		}


		//转base64
		let logdata = "";
		(new Uint8Array(await file.buffer)).forEach((byte) => {
			logdata += String.fromCharCode(byte);
		});
		logdata = btoa(logdata);

		//随机一个key + 一个密码，之后将其拼接起来，存到KV当中。
		let password = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
		let key = generateRandomString(4);

		// 存储数据
		await db.put(
			key + "#" + password,
			JSON.stringify(generateStorageData(logdata, name))
		);

		// 返回log地址
		return {
			data: JSON.stringify({
				url: fronturl + '?key=' + key + '#' + password,
			}), status: 200
		};
	}

	// 读取log
	if (pathname === readpath && request.method === "GET") {
		//获取真正的key
		var trulykey =
			url.searchParams.get("key") + "#" + url.searchParams.get("password");


		//用key取出相应的数据
		var resp = await db.get(trulykey);

		// 返回log数据
		return { data: resp, status: 200 };
	}
	if (pathname === "/favicon.ico") {
		return { data: resp, status: 200 };
	} else {
		return { data: "海豹可爱吗？", status: 200 };
	}
};


//从百度javascript随机字符串里抄来的随机方案
function generateRandomString(length) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		const randomChar = characters.charAt(randomIndex);
		result += randomChar;
	}

	return result;
}
function generateStorageData(data, name) {
	return {
		client: "SealDice",
		created_at: new Date().toISOString(),
		data: data,
		name: name,
		note: "",
		updated_at: new Date().toISOString(),
	};
}
