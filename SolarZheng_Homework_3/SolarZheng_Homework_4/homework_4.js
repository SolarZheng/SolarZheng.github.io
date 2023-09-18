var salary = null,
	bonus = null,
	a,
	b;

function get_salary(a) {
	salary = a;
}

function get_bonus(b) {
	bonus = b;
}

function month_tax(salary) {
	var rate, qcd;
	var res = salary - 3500;
	if (res < 0) {
		return 0;
	} else {
		if (res < 1500)
			rate = 0.03, qcd = 0;
		else if (res <= 4500)
			rate = 0.1, qcd = 105;
		else if (res <= 9000)
			rate = 0.2, qcd = 555;
		else if (res <= 35000)
			rate = 0.25, qcd = 1005;
		else if (res <= 55000)
			rate = 0.3, qcd = 2755;
		else if (res <= 80000)
			rate = 0.35, qcd = 5505;
		else
			rate = 0.45, qcd = 13505;

		return res * rate - qcd;
	}
}

function bonus_tax(salary, bonus) {
	var rate, qcd, res;

	if (salary < 3500) {
		res = (bonus - Math.abs(salary - 3500)) / 12;
		if (res < 1500)
			rate = 0.03;
		else if (res <= 4500)
			rate = 0.1;
		else if (res <= 9000)
			rate = 0.2;
		else if (res <= 35000)
			rate = 0.25;
		else if (res <= 55000)
			rate = 0.3;
		else if (res <= 80000)
			rate = 0.35;
		else
			rate = 0.45;

		if ((bonus - Math.abs(salary - 3500)) * rate >= 0)
			return (bonus - Math.abs(salary - 3500)) * rate;
		else
			return 0;
	} else {
		if (bonus / 12 < 1500)
			rate = 0.3, qcd = 0;
		else if (bonus / 12 <= 4500)
			rate = 0.1, qcd = 105;
		else if (bonus / 12 <= 9000)
			rate = 0.2, qcd = 555;
		else if (bonus / 12 <= 35000)
			rate = 0.25, qcd = 1005;
		else if (bonus / 12 <= 55000)
			rate = 0.3, qcd = 2755;
		else if (bonus / 12 <= 80000)
			rate = 0.35, qcd = 5505;
		else
			rate = 0.45, qcd = 13505;
	}

	if (bonus * rate - qcd >= 0)
		return bonus * rate - qcd;
	else
		return 0;
}

function result_month() {
	document.getElementById("last").innerHTML = "本月应缴税（每月所得税）应为:" + month_tax(salary);
	// document.write("本月应缴税应为:"+month_tax(salary));
}

function result_year() {
	document.getElementById("show").innerHTML = "本年度年终奖应缴税（一次性所得税）应为:" + bonus_tax(salary, bonus);
	// document.write("本年度年终奖应缴税应为:" + bonus_tax(salary));
}

function result_all() {
	var rst = 0;
	rst += bonus_tax(salary, bonus);
	rst += month_tax(salary) * 12;
	document.getElementById("all").innerHTML = "本年总缴税额（全年所得税）应为:" + rst;
}

function reload() {
	history.go(0);
}

(function() {
	var a_idx = 0;
	window.onclick = function(event) {
		var a = new Array("呱~", "呱呱~", "呱呱呱~", "呱呱好可爱~", "麻麻好喜欢~", "呱呱要早点肥家奥~", "认真看书小呱麻麻亲一个~", "路上注意安全呀呱呱~",
			"做家具捏~", "去和朋友们一起玩吧~",
			"又在写什么~(￣▽￣)~", "呱呱给麻麻亲亲~", "小呱呱么么么");

		var heart = document.createElement("b"); //创建b元素
		heart.onselectstart = new Function('event.returnValue=false'); //防止拖动

		document.body.appendChild(heart).innerHTML = a[a_idx]; //将b元素添加到页面上
		a_idx = (a_idx + 1) % a.length;
		heart.style.cssText = "position: fixed;left:-100%;"; //给p元素设置样式

		var f = 16, // 字体大小
			x = event.clientX - f / 2, // 横坐标
			y = event.clientY - f, // 纵坐标
			c = randomColor(), // 随机颜色
			a = 1, // 透明度
			s = 1.2; // 放大缩小

		var timer = setInterval(function() { //添加定时器
			if (a <= 0) {
				document.body.removeChild(heart);
				clearInterval(timer);
			} else {
				heart.style.cssText = "font-size:16px;cursor: default;position: fixed;color:" +
					c + ";left:" + x + "px;top:" + y + "px;opacity:" + a + ";transform:scale(" +
					s + ");";

				y--;
				a -= 0.016;
				s += 0.002;
			}
		}, 15)

	}
	// 随机颜色
	function randomColor() {

		return "rgb(" + (~~(Math.random() * 255)) + "," + (~~(Math.random() * 255)) + "," + (~~(Math
			.random() * 255)) + ")";

	}
}());
K
