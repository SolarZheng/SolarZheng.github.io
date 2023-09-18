var num;

	function isPrime(num) {
		var flag = true;
		for (var i = 2; i <= Math.sqrt(num); i++) {
			if (num % i == 0) {
				flag = false;
				break;
			}
		}
		if (flag && num > 1)
			return num;
		else
			return null;
	}

	function isComposite(num) {
		var flag = false;
		for (var i = 2; i <= Math.sqrt(num); i++) {
			if (num % i == 0) {
				flag = true;
				break;
			}
		}
		if (flag && num > 1)
			alert(num + "是合数");
		else
			alert(num + "不是合数");
	}

	function Prime_colorChange() {
		var table = document.getElementById('tab')
		// var rows = table.getElementsByTagName("tr");
		rows = table.getElementsByTagName("tr");

		for (var i = 0; i < 10; i++) {
			var cells = rows[i].cells;
			for (var j = 0; j < 10; j++) {
				var data = cells[j].innerHTML;
				if (isPrime(parseInt(data)))
					table.rows[i].cells[j].style.background = "#7FFF00";

			}
		}
	}

	function Composite_colorChange() {
		var table = document.getElementById('tab')
		// var rows = table.getElementsByTagName("tr");
		rows = table.getElementsByTagName("tr");

		for (var i = 0; i < 10; i++) {
			var cells = rows[i].cells;
			for (var j = 0; j < 10; j++) {
				var data = cells[j].innerHTML;
				if (!isPrime(parseInt(data)) && parseInt(data) != 1)
					table.rows[i].cells[j].style.background = "#228B22";

			}
		}
	}

	function Return_colorChange() {
		var table = document.getElementById('tab')
		// var rows = table.getElementsByTagName("tr");
		rows = table.getElementsByTagName("tr");

		for (var i = 0; i < 10; i++) {
			var cells = rows[i].cells;
			for (var j = 0; j < 10; j++) {
				var data = cells[j].innerHTML;
				table.rows[i].cells[j].style.background = "transparent";

			}
		}
	}
